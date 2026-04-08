using Gr8.Application.DTOs;
using Gr8.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.interfaces
{
    public interface IPostService
    {
        Task<PostDto> CreateAsync(PostDto post, string userId); // Create Dto? 
            
    }
}
