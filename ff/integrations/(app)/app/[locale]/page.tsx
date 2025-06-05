import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('friday'); // Access the 'friday' namespace
  const tNav = useTranslations('navigation');

  return (
    <main>
      <h1>{t('title')}</h1> {/* Renders "What can I help you with?" in English, "¿En qué puedo ayudarte?" in Spanish, etc. */}
      <p>{t('welcome')}</p>
      <nav>
        <button>{tNav('home')}</button>
        <button>{tNav('automations')}</button>
        <button>{tNav('projects')}</button>
      </nav>
    </main>
  );
}