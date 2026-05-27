using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

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
