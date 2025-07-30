// import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  onJoinClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onJoinClick }) => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (navItem: string) => {
    switch (navItem) {
      case 'О нас':
        scrollToSection('about');
        break;
      case 'Демо':
        scrollToSection('demo');
        break;
      case 'Присоединиться':
        onJoinClick();
        break;
      default:
        break;
    }
  };

  const NAV = ['О нас', 'Демо', 'Присоединиться'];

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center">
      <div className="mt-6 rounded-full bg-white/80 backdrop-blur
                      border border-white/60 shadow-sm
                      px-8 py-2 hidden lg:block">
        <ul className="flex gap-10">
          {NAV.map(item => (
            <li key={item}>
              <button
                onClick={() => handleNavClick(item)}
                className="text-gray900 hover:text-accentDark transition cursor-pointer"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* left logo */}
      <span className="absolute left-8 top-[30px] text-accent font-semibold">
        {/* Bagira AI */}
      </span>
      {/* right language switcher - temporarily hidden */}
      {/* <div className="absolute right-8 top-[30px]">
        <LanguageSwitcher />
      </div> */}
    </header>
  );
};

export default Header;
