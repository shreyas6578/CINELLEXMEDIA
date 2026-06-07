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
        public IActionResult Userform(String Name ,String Email , String Message)
        {
            TempData["Success"] = "Thank you for contacting us!";
            return  RedirectToAction("Index");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
     
        }
    }

}
