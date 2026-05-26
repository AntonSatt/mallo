using Gr8.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Interfaces
{
    public interface IActivityCalenderService
    {
        Task<List<ActivityCalenderDto>> GetActivitiesForMonthAsync(int year, int month);
        Task<List<ActivityCalenderDto>> GetUserCalendarActivitiesAsync(string userId);
        Task<bool> UserCalendarActivityExistsAsync(string userId, int activityId);
        Task AddUserCalendarActivityAsync(string userId, int activityId);
        Task RemoveUserCalendarActivityAsync(string userId, int activityId);
        Task<bool> IsActivityScheduledOnDateAsync(DateTime date);
    }
}
