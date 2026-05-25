using Gr8.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Interfaces
{
    public interface IActivityService
    {
        Task<IEnumerable<ActivityDto>> GetAllActivitiesAsync();

        Task<ActivityDto?> GetActivityByIdAsync(int activityId);

        Task<ActivityDto> CreateActivityAsync(CreateActivityDto createDto, string userId);

        Task<ActivityDto?> UpdateActivityAsync(int activityId, UpdateActivityDto updateDto, string userId);

        Task<bool> DeleteActivityAsync(int activityId, string userId);
    }
}
