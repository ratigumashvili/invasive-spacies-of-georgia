import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/app/ui/button';




export default function HomePage() {
  const t = useTranslations('Common');
  return (
    <section>
      <h1 className='text-2xl font-bold mb-4'>{t('title')}</h1>
      
      <Button asChild>
        <Link href="/about">{t('about')}</Link>
      </Button>
    </section>
  );
}
