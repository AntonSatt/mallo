using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Domain.Entities;

// This file defines the ActivityCalenderService class, which implements the IActivityCalenderService interface.
// The ActivityCalenderService is responsible for managing user calendar activities in the application. It interacts
// with the ICommunityRepository to retrieve and update user calendar activity information in the database.
// The service provides methods to get a user's calendar activities, check if a specific activity is in a user's calendar,
// add or remove activities from a user's calendar, and retrieve activities for a specific month or check if any activities
// are scheduled on a given date. Additionally, when an activity is added to a user's calendar, it also triggers the addition
// of an activity notification for that user.

namespace Gr8.Application.Services
{
    public class ActivityCalenderService : IActivityCalenderService
    {
        private readonly ICommunityRepository _communityRepository;
        private readonly INotificationService _notificationService;

        public ActivityCalenderService(ICommunityRepository communityRepository, INotificationService notificationService)
        {
            _communityRepository = communityRepository;
            _notificationService = notificationService;
        }

        public async Task<List<ActivityCalenderDto>> GetUserCalendarActivitiesAsync(string userId)
        {
            var entries = await _communityRepository.GetUserCalendarActivitiesAsync(userId);
            return entries.Select(e => new ActivityCalenderDto
            {
                ActivityId = e.ActivityId,
                UserId = userId,
                Title = e.Activity.Title,
                StartAt = e.Activity.StartAt
            }).ToList();
        }

        public async Task<bool> UserCalendarActivityExistsAsync(string userId, int activityId)
        {
            var entry = await _communityRepository.GetUserCalendarActivityAsync(userId, activityId);
            return entry != null;
        }

        public async Task AddUserCalendarActivityAsync(string userId, int activityId)
        {
            var entry = new ActivityCalender { UserId = userId, ActivityId = activityId };
            await _communityRepository.AddUserCalendarActivityAsync(entry);
            await _communityRepository.SaveChangesAsync();
            await _notificationService.AddActivityNotificationAsync(activityId, userId);
        }

        public async Task RemoveUserCalendarActivityAsync(string userId, int activityId)
        {
            var entry = await _communityRepository.GetUserCalendarActivityAsync(userId, activityId);
            if (entry != null)
            {
                _communityRepository.RemoveUserCalendarActivityAsync(entry);
                await _communityRepository.SaveChangesAsync();
            }
        }

        public async Task<List<ActivityCalenderDto>> GetActivitiesForMonthAsync(int year, int month)
        {
            var activities = await _communityRepository.GetAllActivitiesAsync();
            return activities
                .Where(a => a.StartAt.Year == year && a.StartAt.Month == month)
                .Select(a => new ActivityCalenderDto
                {
                    ActivityId = a.Id,
                    Title = a.Title,
                    StartAt = a.StartAt
                })
                .ToList();
        }

        public async Task<bool> IsActivityScheduledOnDateAsync(DateTime date)
        {
            var activities = await _communityRepository.GetAllActivitiesAsync();
            return activities.Any(a => a.StartAt.Date == date.Date);
        }
    }
}
