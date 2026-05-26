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
                    Url = activity.Url,
                    Latitude = activity.Latitude,
                    Longitude = activity.Longitude,
                    Adress = activity.Adress,
                    StartAt = activity.StartAt,
                    EndAt = activity.EndAt,
                    IsEdited = activity.IsEdited,
                    UserId = activity.UserId,
                    Image = activity.Image,
                    ImageMimeType = activity.ImageMimeType,
                    AuthorInfo = new AuthorDTO
                    {
                        Id = activity.UserId,
                        UserName = await _applicationRepository.GetUserNameByIdAsync(activity.UserId) ?? "Unknown",
                        AvatarId = await _applicationRepository.GetAvatarIdByUserIdAsync(activity.UserId)
                    }

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
                Url = activity.Url,
                Latitude = activity.Latitude,
                Longitude = activity.Longitude,
                Adress = activity.Adress,
                StartAt = activity.StartAt,
                EndAt = activity.EndAt,
                IsEdited = activity.IsEdited,
                UserId = activity.UserId,
                Image = activity.Image,
                ImageMimeType = activity.ImageMimeType,
                AuthorInfo = new AuthorDTO
                {
                    Id = activity.UserId,
                    UserName = await _applicationRepository.GetUserNameByIdAsync(activity.UserId) ?? "Unknown",
                    AvatarId = await _applicationRepository.GetAvatarIdByUserIdAsync(activity.UserId)
                }
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
                Url = createDto.Url,
                Latitude = createDto.Latitude,
                Longitude = createDto.Longitude,
                Adress = createDto.Adress,
                StartAt = createDto.StartAt,
                EndAt = createDto.EndAt,
                IsDeleted = false,
                IsEdited = false,
                Image = createDto.Image,
                ImageMimeType = createDto.ImageMimeType
            };

            await _communityRepository.AddActivityAsync(activity);
            await _communityRepository.SaveChangesAsync();

            var activityDto = new ActivityDto
            {
                Id = activity.Id,
                Title = activity.Title,
                Description = activity.Description,
                Url = activity.Url,
                Latitude = activity.Latitude,
                Longitude = activity.Longitude,
                Adress = activity.Adress,
                StartAt = activity.StartAt,
                EndAt = activity.EndAt,
                IsEdited = activity.IsEdited,
                UserId = activity.UserId,
                Image = activity.Image,
                ImageMimeType = activity.ImageMimeType,
                AuthorInfo = new AuthorDTO
                {
                    Id = activity.UserId,
                    UserName = await _applicationRepository.GetUserNameByIdAsync(activity.UserId) ?? "Unknown",
                    AvatarId = await _applicationRepository.GetAvatarIdByUserIdAsync(activity.UserId)
                }
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
            existing.Url = updateDto.Url;
            existing.Latitude = updateDto.Latitude;
            existing.Longitude = updateDto.Longitude;
            existing.Adress = updateDto.Adress;
            existing.StartAt = updateDto.StartAt;
            existing.EndAt = updateDto.EndAt;
            existing.IsEdited = true;
            existing.Image = updateDto.Image;
            existing.ImageMimeType = updateDto.ImageMimeType;

            await _communityRepository.UpdateActivityAsync(existing);
            await _communityRepository.SaveChangesAsync();

            var activityDto = new ActivityDto
            {
                Id = existing.Id,
                Title = existing.Title,
                Description = existing.Description,
                Url = existing.Url,
                Latitude = existing.Latitude,
                Longitude = existing.Longitude,
                Adress = existing.Adress,
                StartAt = existing.StartAt,
                EndAt = existing.EndAt,
                IsEdited = existing.IsEdited,
                UserId = existing.UserId,
                Image = existing.Image,
                ImageMimeType = existing.ImageMimeType,
                AuthorInfo = new AuthorDTO
                {
                    Id = existing.UserId,
                    UserName = await _applicationRepository.GetUserNameByIdAsync(existing.UserId) ?? "Unknown",
                    AvatarId = await _applicationRepository.GetAvatarIdByUserIdAsync(existing.UserId)
                }
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