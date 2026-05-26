using Gr8.Application.Interfaces;
using Gr8.Application.Services;
using Gr8.Infrastructure.Identity;
using Gr8.Infrastructure.Persistence;
using Gr8.Infrastructure.Persistence.Repositories;
using Gr8.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Gr8.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            // Configure Entity Framework Core to use SQL Server with the connection string from configuration
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                    sqlOptions => sqlOptions.EnableRetryOnFailure()));

            // Configure Entity Framework Core to use SQL Server for the CommunityDbContext
            services.AddDbContext<CommunityDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                    sqlOptions => sqlOptions.EnableRetryOnFailure()));

            services.AddScoped<ICommunityRepository, CommunityRepository>();
            services.AddScoped<IPostService, PostService>();
            services.AddScoped<ICommentService, CommentService>();
            services.AddScoped<ITagService, TagService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IApplicationRepository, ApplicationRepository>();
            services.AddScoped<IReportService, ReportService>();
            services.AddScoped<IHugService, HugService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IBookmarkService,BookmarkService>();
            services.AddScoped<IActivityService, ActivityService>();
            services.AddScoped<IChatRepository, ChatRepository>();
            services.AddScoped<IChatService, ChatService>();
            services.AddScoped<IUserTagService, UserTagService>();
            services.AddScoped<IActivityBookmarkService, ActivityBookmarkService>();
            services.AddScoped<IActivityCalenderService, ActivityCalenderService>();
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<IFirebasePushService, FirebasePushService>();

            // Configure ASP.NET Core Identity to use the ApplicationUser and ApplicationRole classes, and to use Entity Framework Core for storage
            services.AddIdentity<ApplicationUser, ApplicationRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            // Configure JWT settings and register the JWT token generator service
            var jwtSettings = configuration.GetSection("Jwt").Get<JwtSettings>();

            services.AddSingleton<JwtSettings>(jwtSettings);
            services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

            return services;
        }
    }
}
