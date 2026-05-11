using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Domain.Entities;

namespace Gr8.Application.Services
{
    public class ActivityService : IActivityService
    {
        private readonly ICommunityRepository _communityRepository;

        private readonly IApplicationRepository _applicationRepository;

        public ActivityService(ICommunityRepository communityRepository, IApplicationRepository applicationRepository)
        {
            _communityRepository = communityRepository;
            _applicationRepository = applicationRepository;
        }

        public async Task<IEnumerable<ActivityDto>> GetAllActivitiesAsync()
        {
            var activities = await _communityRepository.GetAllActivitiesAsync();
            var activitiesDtoList = new List<ActivityDto>();

            foreach (var activity in activities)
            {
                if (activity.IsDeleted)
                {
                    continue; 
                }

                var activityDto = new ActivityDto
                {
                    Id = activity.Id,
                    Title = activity.Title,
                    Description = activity.Description,
                    Latitude = activity.Latitude,
                    Longitude = activity.Longitude,
                    StartAt = activity.StartAt,
                    EndAt = activity.EndAt,
                    IsEdited = activity.IsEdited,
                    UserId = activity.UserId
                };

                var fullName = await _applicationRepository.GetFullNameByIdAsync(activity.UserId);

                if (fullName != null)
                {
                    activityDto.FullName = fullName;
                }

                activitiesDtoList.Add(activityDto);
            }
            return activitiesDtoList;
        }

        public async Task<ActivityDto?> GetActivityByIdAsync(int id)
        {
            var activity = await _communityRepository.GetActivityByIdAsync(id);

            if (activity == null || activity.IsDeleted)
            {
                return null;
            }

            var activityDto = new ActivityDto
            {
                Id = activity.Id,
                Title = activity.Title,
                Description = activity.Description,
                Latitude = activity.Latitude,
                Longitude = activity.Longitude,
                StartAt = activity.StartAt,
                EndAt = activity.EndAt,
                IsEdited = activity.IsEdited,
                UserId = activity.UserId
            };

            var userName = await _applicationRepository.GetFullNameByIdAsync(activityDto.UserId);

            if (userName != null)
            {
                activityDto.FullName = userName;
            }

            return activityDto;
        }

        public async Task<ActivityDto> CreateActivityAsync(CreateActivityDto createDto, string userId)
        {
            var activity = new Activity(userId)
            {
                Title = createDto.Title,
                Description = createDto.Description,
                Latitude = createDto.Latitude,
                Longitude = createDto.Longitude,
                StartAt = createDto.StartAt,
                EndAt = createDto.EndAt,
                IsDeleted = false,
                IsEdited = false
            };

            await _communityRepository.AddActivityAsync(activity);
            await _communityRepository.SaveChangesAsync();

            var activityDto = new ActivityDto
            {
                Id = activity.Id,
                Title = activity.Title,
                Description = activity.Description,
                Latitude = activity.Latitude,
                Longitude = activity.Longitude,
                StartAt = activity.StartAt,
                EndAt = activity.EndAt,
                IsEdited = activity.IsEdited,
                UserId = activity.UserId
            };

            var userName = await _applicationRepository.GetFullNameByIdAsync(activityDto.UserId);

            if (userName != null)
            {
                activityDto.FullName = userName;
            }

            return activityDto;
        }

        public async Task<ActivityDto?> UpdateActivityAsync(int id, UpdateActivityDto updateDto, string userId)
        {
            var existing = await _communityRepository.GetActivityByIdAsync(id);

            if (existing == null || existing.IsDeleted)
            {
                return null;
            }

            if (existing.UserId != userId)
            {
                throw new UnauthorizedAccessException();
            }

            existing.Title = updateDto.Title;
            existing.Description = updateDto.Description;
            existing.Latitude = updateDto.Latitude;
            existing.Longitude = updateDto.Longitude;
            existing.StartAt = updateDto.StartAt;
            existing.EndAt = updateDto.EndAt;
            existing.IsEdited = true;

            await _communityRepository.UpdateActivityAsync(existing);
            await _communityRepository.SaveChangesAsync();

            var activityDto = new ActivityDto
            {
                Id = existing.Id,
                Title = existing.Title,
                Description = existing.Description,
                Latitude = existing.Latitude,
                Longitude = existing.Longitude,
                StartAt = existing.StartAt,
                EndAt = existing.EndAt,
                IsEdited = existing.IsEdited,
                UserId = existing.UserId
            };

            var userName = await _applicationRepository.GetFullNameByIdAsync(activityDto.UserId);

            if (userName != null)
            {
                activityDto.FullName = userName;
            }

            return activityDto;
        }

        public async Task<bool> DeleteActivityAsync(int id, string userId)
        {
            var existing = await _communityRepository.GetActivityByIdAsync(id);

            if (existing == null || existing.IsDeleted)
            {
                return false;
            }

            if (existing.UserId != userId)
            {
                throw new UnauthorizedAccessException();
            }

            existing.IsDeleted = true;

            await _communityRepository.UpdateActivityAsync(existing);
            await _communityRepository.SaveChangesAsync();

            return true;
        }
    }
}