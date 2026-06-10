using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace FoodeX.API.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(
            string toEmail,
            string subject,
            string body)
        {
            var senderName =
                _configuration["EmailSettings:SenderName"] ?? "FoodeX";

            var senderEmail =
                _configuration["EmailSettings:SenderEmail"] ?? "";

            var password =
                _configuration["EmailSettings:Password"] ?? "";

            var smtpServer =
                _configuration["EmailSettings:SmtpServer"] ?? "smtp.gmail.com";

            var port =
                int.Parse(_configuration["EmailSettings:Port"] ?? "587");

            var email = new MimeMessage();

            email.From.Add(new MailboxAddress(senderName, senderEmail));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;

            email.Body = new TextPart("plain")
            {
                Text = body
            };

            using var smtp = new SmtpClient();

            await smtp.ConnectAsync(
                smtpServer,
                port,
                SecureSocketOptions.StartTls
            );

            await smtp.AuthenticateAsync(senderEmail, password);

            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}