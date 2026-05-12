using Gr8.Api.Endpoints;
using Gr8.Application.Common.Constants;
using Gr8.Infrastructure;
using Gr8.Infrastructure.Hubs;
using Gr8.Infrastructure.Identity;
using Gr8.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Text;

namespace Gr8
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

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

                    //signalRtest
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];

                            // Om begäran går till vår hub-väg
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) &&
                                (path.StartsWithSegments("/chat/hub")))
                            {
                                // Läs in token från query-strängen så att [Authorize] i Hubben fungerar
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

            var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                              ?? new[] { "http://localhost:5173" };

            // Lägg till testverktygets adress i listan
            var allOrigins = corsOrigins.Append("https://gourav-d.github.io").ToArray();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("ReactApplication", policy =>
                {
                    policy.SetIsOriginAllowed(origin => true)
                    //policy.WithOrigins(corsOrigins)
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials(); // For Websockets
                });
            });

            builder.Services.AddOpenApi();

            builder.Services.AddInfrastructure(builder.Configuration);

            // SignalR
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

            app.UseCors("ReactApplication");

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapEndpoints();

            app.MapHub<ChatHub>("/chat/hub");

            app.Run();
        }
    }
}
