import clsx from 'clsx';
import { THEME, useTheme } from "./context/ThemeProvider";


export default function ThemeContent() : Element {
    const {theme} = useTheme();
    
    const isLightMode = theme === THEME.LIGHT; 
    return (
        <div className={clsx(
            'p-4 h-dvh w-full',
            isLightMode ? 'bg-white' : 'bg-gray-800')}
        >
        <h1 className={clsx(
            'text-2xl font-bold',
            isLightMode ? 'text-black' : 'text-white'
        )}> Theme Content</h1>
        <p className={clsx('mt-2', isLightMode ? 'text-black' : 'text-white')}>
            '다크 변환 너무 신기하다!'</p>
        </div>
    );
}