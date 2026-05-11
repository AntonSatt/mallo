using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Interfaces
{
    public interface IChatClient
    {
        Task ReceiveMessage(string user, string message);
    }
}
