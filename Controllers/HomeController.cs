using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult About() 
        { 
             return View();
        }
        public IActionResult Privacy()
        {
            return View();
        }
        public IActionResult Services()
        {
            return View();
        }
        public IActionResult Gallery()
        {
            return View();
        }

        public IActionResult Userform1()
        {
            return View();
        }
        [HttpPost]
        public IActionResult Userform(String Name ,String email , String Message ,String number ,String package )
        {
            String user = Name;
            String Email = email;
            String text = Message;
            String num = number;
            Console.WriteLine(Name+""+Email+""+text+""+num);
            string whatsappMessage =
                $"Hi Uttkarsh,\n" +
                $"My name is {Name}, and I am interested in the {package} package offered by Cinellex Media.\n" +
                $"{Message}\n" +
                $"You can reach me using the contact details below:\n" +
                $"Phone: {number}\n" +
                $"Email: {email}\n" +
                $"I would appreciate the opportunity to discuss this further and learn more about your services.\n" +
                $"Thank you, and I look forward to your response.\n" +
                $"Best regards,\n{Name}";

            string encodedMessage = Uri.EscapeDataString(whatsappMessage);
            string whatsappNumber = "917208666131";
            string whatsappUrl = $"https://wa.me/{whatsappNumber}?text={encodedMessage}";

            return Redirect(whatsappUrl);
            // return RedirectToAction("Index", "Home");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
     
        }
    }

}
