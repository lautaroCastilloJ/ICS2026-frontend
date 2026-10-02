import { useTheme } from '../theme/theme';
import IconButton from './IconButton';
import { MoonIcon, SunIcon } from './icons';

/** Alterna entre tema claro y oscuro; la eleccion se recuerda entre visitas. */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <IconButton label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'} onClick={toggleTheme}>
      {isDark ? <SunIcon /> : <MoonIcon />}
    </IconButton>
  );
}

export default ThemeToggle;
