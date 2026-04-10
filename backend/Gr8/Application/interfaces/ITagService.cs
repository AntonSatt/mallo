using Gr8.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Interfaces
{
    public interface ITagService
    {
        Task<List<TagDto>> GetAllTagsAsync();
    }
}
