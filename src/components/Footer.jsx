import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Mail } from "lucide-react"
import Logo from "./Logo"

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center">
              <Logo />
              <span className="ml-2 text-xl font-bold text-white">Eventify</span>
            </div>
            <p className="mt-2 text-sm text-gray-300">Ghana's premier event management and ticketing platform.</p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Discover Events</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  All Events
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  This Weekend
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Free Events
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Music
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Food & Drink
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Organizers</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white">
                  Create Events
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-sm text-gray-300 text-center">
            &copy; {new Date().getFullYear()} Eventify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
