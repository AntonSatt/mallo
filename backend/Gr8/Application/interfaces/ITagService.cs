using Gr8.Application.DTOs;

namespace Gr8.Application.Interfaces
{
    public interface ITagService
    {
        Task<List<TagDto>> GetAllTagsAsync();
    }
}
