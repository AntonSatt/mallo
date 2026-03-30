using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Infrastructure.Persistence
{
    public class CommunityDbContext : DbContext
    {
        public CommunityDbContext(DbContextOptions<CommunityDbContext> options) : base(options)
        {
            
        }
    }
}
