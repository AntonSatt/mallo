using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.interfaces
{
    public interface IEmailService
    {
        Task SendAsync(string to, string subject, string htmlBody);
    }
}
