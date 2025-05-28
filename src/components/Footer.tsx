import { Link } from "react-router-dom";
import { Github, Twitter, Facebook, Instagram } from "lucide-react";
import { SOCIAL_LINKS } from "@/constants/staticContent";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className='bg-primary text-white'>
      <div className='container mx-auto px-4 py-12'>
        <div className='flex justify-center mb-8'>
          <Logo
            size='lg'
            darkMode
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div>
            <h3 className='text-xl font-semibold mb-4'>About</h3>
            <p className='mb-4 text-primary-foreground/80'>
              Discover the world with WanderWave. Your trusted partner in
              creating unforgettable travel experiences.
            </p>
          </div>

          <div>
            <h3 className='text-xl font-semibold mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/destinations'
                  className='text-primary-foreground/80 hover:text-white transition-colors'>
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  to='/bookings'
                  className='text-primary-foreground/80 hover:text-white transition-colors'>
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  to='/about'
                  className='text-primary-foreground/80 hover:text-white transition-colors'>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to='/contact'
                  className='text-primary-foreground/80 hover:text-white transition-colors'>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='text-xl font-semibold mb-4'>Legal</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/privacy'
                  className='text-primary-foreground/80 hover:text-white transition-colors'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to='/terms'
                  className='text-primary-foreground/80 hover:text-white transition-colors'>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='text-xl font-semibold mb-4'>Follow Us</h3>
            <div className='flex space-x-4'>
              <a
                href={SOCIAL_LINKS.github}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary-foreground/80 hover:text-white transition-colors'
                aria-label='GitHub'>
                <Github className='h-6 w-6' />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary-foreground/80 hover:text-white transition-colors'
                aria-label='Twitter'>
                <Twitter className='h-6 w-6' />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary-foreground/80 hover:text-white transition-colors'
                aria-label='Facebook'>
                <Facebook className='h-6 w-6' />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary-foreground/80 hover:text-white transition-colors'
                aria-label='Instagram'>
                <Instagram className='h-6 w-6' />
              </a>
            </div>
          </div>
        </div>

        <div className='mt-8 pt-8 border-t border-white/10 text-center'>
          <p className='text-primary-foreground/80'>
            &copy; {new Date().getFullYear()} WanderWave. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
