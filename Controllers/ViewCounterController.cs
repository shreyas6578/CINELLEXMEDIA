using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Controllers
{
    public class ViewCounterController : Controller
    {

     public IActionResult Views()
        {
            
            return View();
        }
    }
}

