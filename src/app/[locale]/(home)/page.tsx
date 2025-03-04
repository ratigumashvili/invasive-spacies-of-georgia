import { useTranslations } from 'next-intl';


export default function HomePage() {
  const t = useTranslations('Common');
  return (
    <section>
      home
    </section>
  );
}
