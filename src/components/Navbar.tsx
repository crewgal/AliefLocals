import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/alief-locals-logo.png";

const categories = [
  { name: "Restaurants", slug: "restaurants" },
  { name: "Mechanics", slug: "mechanics" },
  { name: "Dentists", slug: "dentists" },
  { name: "Car Insurance", slug: "car-insurance" },
  { name: "Barber Shops", slug: "barber-shops" },
  { name: "Churches", slug: "churches" },
  { name: "Car Dealerships", slug: "car-dealerships" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-4">
        <Link to="/">
          <img src={logo} alt="Alief Locals" className="h-20 my-3" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {categories.slice(0, 5).map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <Link to="/jobs" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Jobs
          </Link>
          <Link to="/get-listed" className="ml-4 px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity">
            Get Listed
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-card px-6 pb-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
          <Link to="/jobs" className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>
            Jobs
          </Link>
          <Link to="/get-listed" className="mt-2 block text-center w-full px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-full" onClick={() => setOpen(false)}>
            Get Listed
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
