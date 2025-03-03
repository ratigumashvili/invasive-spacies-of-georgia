import {useTranslations} from 'next-intl';
import { Link } from '@/i18n/routing';
 
export default function HomePage() {
  const t = useTranslations('Common');
  return (
    <section>
      <h1>{t('title')}</h1>
      <Link href="/about">{t('about')}</Link>
    </section>
  );
}
