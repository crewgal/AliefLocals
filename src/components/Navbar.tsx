import { useState } from "react";
import { Menu, X } from "lucide-react";

const categories = [
  "Restaurants",
  "Mechanics",
  "Dentists",
  "Car Insurance",
  "Barber Shops",
  "Churches",
  "Car Dealerships",
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <a href="/" className="font-serif text-xl font-semibold tracking-tight text-foreground">
          Alief <span className="text-primary">Locals</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {categories.slice(0, 5).map((cat) => (
            <a
              key={cat}
              href={`#${cat.toLowerCase().replace(/\s/g, "-")}`}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {cat}
            </a>
          ))}
          <a href="#get-listed" className="ml-4 px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity">
            Get Listed
          </a>
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
            <a
              key={cat}
              href={`#${cat.toLowerCase().replace(/\s/g, "-")}`}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {cat}
            </a>
          ))}
          <a href="#get-listed" className="mt-2 block text-center w-full px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-full" onClick={() => setOpen(false)}>
            Get Listed
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
