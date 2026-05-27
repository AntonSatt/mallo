using Gr8.Application.Interfaces;
using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;

// This file defines the EmailService class, which implements the IEmailService interface. It uses the MailKit library to
// send emails via SMTP. The service retrieves email configuration settings from the application's configuration,
// such as the SMTP host, port, username, and password. The SendAsync method constructs an email message and sends it
// to the specified recipient with the given subject and HTML body content.

namespace Gr8.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendAsync(string to, string subject, string htmlBody)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("GR8", _configuration["Email:From"]));
            message.To.Add(new MailboxAddress("", to));
            message.Subject = subject;
            message.Body = new TextPart("html") { Text = htmlBody };

            using var client = new SmtpClient();
            await client.ConnectAsync(
                _configuration["Email:SmtpHost"],
                int.Parse(_configuration["Email:SmtpPort"]!),
                MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(
                _configuration["Email:Username"],
                _configuration["Email:Password"]);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}