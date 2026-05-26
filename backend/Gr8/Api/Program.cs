using Gr8.Api.Endpoints;
using Gr8.Application.Common.Constants;
using Gr8.Infrastructure;
using Gr8.Infrastructure.Hubs;
using Gr8.Infrastructure.Identity;
using Gr8.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Text;
using Prometheus;
using Gr8.Application.Interfaces;
using Gr8.Infrastructure.Services;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;

namespace Gr8
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            FirebaseApp.Create(new AppOptions() 
            {
                Credential = GoogleCredential.FromFile("firebase-adminsdk.json")
            });

            var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>();

            // Add services to the container.
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwtSettings.Issuer,
                        ValidAudience = jwtSettings.Audience,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(jwtSettings.Key))
                    };

                    // Allows SignalR connections to authenticate using JWT tokens from the query string.
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"].FirstOrDefault();

                            if (!string.IsNullOrEmpty(accessToken) &&
                                accessToken.StartsWith("Bearer "))
                            {
                                accessToken = accessToken["Bearer ".Length..].Trim();
                            }

                            if (!string.IsNullOrEmpty(accessToken) &&
                                context.HttpContext.Request.Path.StartsWithSegments("/chat"))
                            {
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        }
                    };
                });

            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy(AuthorizationConstants.JwtOnly, policy =>
                {
                    policy.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
                    policy.RequireAuthenticatedUser();
                });

                //TODO: Add Admin role
                //options.AddPolicy(AuthorizationConstants.AdminOnly, policy =>
                //{
                //    policy.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
                //    policy.RequireRole("Admin");
                //});
            });

            // Add HttpClient dependency injection for MapBoxService with baseurl settings
            builder.Services.AddHttpClient<IMapBoxService, MapBoxService>(client =>
            {
                client.BaseAddress = new Uri(builder.Configuration.GetSection("Mapbox:BaseUrl").Get<string>() ?? "https://api.mapbox.com/");
            });

            var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                              ?? new[] { "http://localhost:5173" };

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("ReactApplication", policy =>
                {
                    policy.WithOrigins(corsOrigins)
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials(); // authentication via JWT/websocket.
                });
            });

            builder.Services.AddOpenApi();

            builder.Services.AddInfrastructure(builder.Configuration);

            builder.Services.AddSignalR();

            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                await scope.ServiceProvider.GetRequiredService<ApplicationDbContext>().Database.MigrateAsync();
                await scope.ServiceProvider.GetRequiredService<CommunityDbContext>().Database.MigrateAsync();
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference();
                await SeedData.EnsureSeedDataAsync(app.Services);
            }

            app.UseRouting();

            app.UseCors("ReactApplication");

            app.UseHttpsRedirection();

            app.UseHttpMetrics();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapMetrics();

            app.MapEndpoints();

            app.MapHub<ChatHub>("/chat/hub");

            app.Run();
        }
    }
}
