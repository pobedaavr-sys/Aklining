/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  Send, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Wrench, 
  Gem,
  Droplets,
  Wind,
  Layers,
  Maximize,
  Menu,
  X
} from 'lucide-react';

// --- Constants ---

const IMAGES = {
  hero: "https://raw.githubusercontent.com/pobedaavr-sys/klining/main/Hero_%E2%84%961.png",
  process: "https://raw.githubusercontent.com/pobedaavr-sys/klining/main/№2.png",
  renovation: [
    "https://raw.githubusercontent.com/pobedaavr-sys/klining/main/№3_1.png",
    "https://raw.githubusercontent.com/pobedaavr-sys/klining/main/№3_2.png",
    "https://raw.githubusercontent.com/pobedaavr-sys/klining/main/№3_3.png"
  ],
  designer: [
    "https://raw.githubusercontent.com/pobedaavr-sys/klining/main/№4_0.png",
    "https://raw.githubusercontent.com/pobedaavr-sys/klining/main/№4_2..png",
    "https://raw.githubusercontent.com/pobedaavr-sys/klining/main/№4_3.png"
  ],
  office: "https://raw.githubusercontent.com/pobedaavr-sys/klining/main/№5_1.png",
  beforeAfter: [
    "https://raw.githubusercontent.com/pobedaavr-sys/klining/main/№6_2.png",
    "https://raw.githubusercontent.com/pobedaavr-sys/klining/main/№6_3.jpg"
  ],
  commercial: "https://raw.githubusercontent.com/pobedaavr-sys/klining/main/№7_1.png"
};

const CONTACTS = {
  phone: "+7 (986) 989-75-69",
  telegram: "https://t.me/spb_alhimik",
  tgNick: "spb_alhimik",
  address: "Лесная, Санкт-Петербург"
};

// --- Components ---

const SectionTitle = ({ title, subtitle, light = false }: { title: string, subtitle?: string, light?: boolean }) => (
  <div className="mb-16">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`text-3xl md:text-5xl lg:text-6xl mb-6 leading-tight ${light ? 'text-white' : 'text-brand-ink'}`}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`text-lg md:text-xl max-w-2xl font-light leading-relaxed ${light ? 'text-white/70' : 'text-brand-ink/60'}`}
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '' }: { children: React.ReactNode, onClick?: () => void, variant?: 'primary' | 'outline' | 'white', className?: string }) => {
  const baseStyles = "px-8 py-4 rounded-full transition-all duration-300 font-medium text-sm tracking-wider uppercase flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-brand-ink text-white hover:bg-brand-accent",
    outline: "border border-brand-ink text-brand-ink hover:bg-brand-ink hover:text-white",
    white: "bg-white text-brand-ink hover:bg-brand-muted"
  };
  
  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Form = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    
    setStatus('loading');
    
    try {
      const response = await fetch('/api/send-lead', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      if (response.ok && result.success) {
        setStatus('success');
        setFormData({ name: '', phone: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Произошла ошибка при отправке');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setStatus('error');
      setErrorMessage('Сетевая ошибка. Проверьте соединение.');
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          placeholder="Имя" 
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-6 py-4 rounded-xl bg-white border border-brand-muted focus:border-brand-accent outline-none transition-colors"
        />
        <input 
          type="tel" 
          placeholder="Ваш номер телефона" 
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-6 py-4 rounded-xl bg-white border border-brand-muted focus:border-brand-accent outline-none transition-colors"
        />
        <Button variant="primary" className="w-full" onClick={() => {}}>
          {status === 'loading' ? 'Отправка...' : 'Оставить заявку'}
        </Button>
        
        <AnimatePresence>
          {status === 'success' && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-emerald-600 text-sm text-center font-medium"
            >
              Заявка успешно отправлена!
            </motion.p>
          )}
          {status === 'error' && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-rose-600 text-sm text-center font-medium"
            >
              {errorMessage || 'Ошибка при отправке. Попробуйте позже.'}
            </motion.p>
          )}
        </AnimatePresence>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-brand-ink/50 mb-4">Свяжемся с вами и уточним детали</p>
        <div className="flex items-center justify-center gap-4">
          <span className="text-xs uppercase tracking-widest text-brand-ink/30">Или напишите нам</span>
          <a href={CONTACTS.telegram} target="_blank" rel="noreferrer" className="text-brand-accent hover:text-brand-ink transition-colors flex items-center gap-1 font-medium">
            <Send size={14} /> Telegram
          </a>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const scrollToForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen selection:bg-brand-accent selection:text-white">
      {/* --- Navigation --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/80 backdrop-blur-lg border-b border-brand-muted">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-serif tracking-widest uppercase">Алхимик</span>
            <span className="text-[10px] uppercase tracking-widest text-brand-ink/40 -mt-1">Premium Cleaning</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-widest font-medium">
            <div className="flex items-center gap-2 text-brand-ink/60">
              <MapPin size={14} className="text-brand-accent" />
              <span>{CONTACTS.address}</span>
            </div>
            <div className="flex items-center gap-2 text-brand-ink/60">
              <Phone size={14} className="text-brand-accent" />
              <span>{CONTACTS.phone}</span>
            </div>
            <a href={CONTACTS.telegram} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-brand-accent transition-colors">
              <Send size={14} className="text-brand-accent" />
              <span>{CONTACTS.tgNick}</span>
            </a>
          </div>

          <Button variant="outline" className="hidden sm:flex py-2 px-6 text-[10px]" onClick={scrollToForm}>
            Оставить заявку
          </Button>
          
          <button 
            className="lg:hidden text-brand-ink p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-brand-bg border-b border-brand-muted overflow-hidden"
            >
              <div className="px-6 py-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-brand-ink/60 text-sm">
                    <MapPin size={16} className="text-brand-accent" />
                    <span>{CONTACTS.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-brand-ink/60 text-sm">
                    <Phone size={16} className="text-brand-accent" />
                    <span>{CONTACTS.phone}</span>
                  </div>
                  <a href={CONTACTS.telegram} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-brand-ink/60 text-sm">
                    <Send size={16} className="text-brand-accent" />
                    <span>{CONTACTS.tgNick}</span>
                  </a>
                </div>
                <Button variant="primary" className="w-full" onClick={scrollToForm}>
                  Оставить заявку
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-20 min-h-screen flex flex-col">
        <div className="flex-1 grid lg:grid-cols-2">
          <div className="section-padding flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1 rounded-full border border-brand-accent/30 text-brand-accent text-[10px] uppercase tracking-widest mb-8">
                Санкт-Петербург
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl mb-8 leading-[1.2] md:leading-[0.95] tracking-tight break-words">
                Профессиональный клининг <br className="hidden md:block" />
                <span className="text-brand-accent italic font-light">частных и коммерческих</span> объектов
              </h1>
              <p className="text-lg md:text-xl text-brand-ink/60 font-light max-w-xl mb-10 leading-relaxed">
                Нас выбирают там, где важны аккуратность, деликатная работа с материалами и предсказуемый результат. Берём в работу квартиры, дома, офисы и объекты после ремонта.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-16">
                <Button variant="primary" onClick={scrollToForm}>
                  Оставить заявку <ArrowRight size={18} />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-12 border-t border-brand-muted pt-12">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-brand-ink/40 mb-6">Нам доверяют</h4>
                  <ul className="space-y-3 text-sm font-light">
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-brand-accent" /> Дизайнеры интерьеров</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-brand-accent" /> Хоум-стейджеры</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-brand-accent" /> Строительные команды</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-brand-ink/40 mb-6">Опыт на объектах</h4>
                  <ul className="space-y-3 text-sm font-light">
                    <li className="flex items-center gap-2"><Gem size={14} className="text-brand-accent" /> Дворец Бельведер</li>
                    <li className="flex items-center gap-2"><Gem size={14} className="text-brand-accent" /> Спас на Крови</li>
                    <li className="flex items-center gap-2"><Gem size={14} className="text-brand-accent" /> Невская Ратуша</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="relative h-[50vh] lg:h-auto overflow-hidden">
            <motion.img 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              src={IMAGES.hero} 
              alt="Premium Interior" 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-bg lg:from-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* --- For Whom --- */}
      <section className="bg-white">
        <div className="section-padding">
          <SectionTitle 
            title="Для кого наши услуги" 
            subtitle="Подбираем формат клининга под тип помещения, уровень отделки и задачу клиента"
          />
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Частные клиенты",
                desc: "Квартиры, дома, загородная недвижимость. Поддерживаем чистоту в пространствах, где важны деликатность и бережное отношение.",
                icon: <Sparkles className="text-brand-accent" size={32} />
              },
              {
                title: "Бизнес",
                desc: "Офисы, общепит, медицинские учреждения. Организуем клининг с учётом специфики объекта и требований к чистоте.",
                icon: <ShieldCheck className="text-brand-accent" size={32} />
              },
              {
                title: "Партнёры",
                desc: "Дизайнеры, хоум-стейджеры, строители. Подключаемся на этапах подготовки объекта и сдачи после ремонта.",
                icon: <Wrench className="text-brand-accent" size={32} />
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-10 rounded-3xl border border-brand-muted hover:border-brand-accent transition-colors group"
              >
                <div className="mb-8 group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                <h3 className="text-2xl mb-4">{item.title}</h3>
                <p className="text-brand-ink/60 font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Main Services --- */}
      <section className="bg-brand-bg">
        <div className="section-padding">
          <SectionTitle 
            title="Основные услуги" 
            subtitle="Закрываем как разовые задачи, так и регулярное обслуживание объектов"
          />
          
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                title: "Уборка после ремонта",
                desc: "Удаляем строительную пыль, очищаем поверхности, приводим объект в готовое состояние перед заселением.",
                img: IMAGES.renovation[0]
              },
              {
                title: "Генеральная уборка",
                desc: "Глубокая комплексная уборка квартиры, дома или коммерческого помещения с проработкой всех зон.",
                img: IMAGES.process
              },
              {
                title: "Поддерживающая уборка",
                desc: "Регулярное поддержание чистоты без потери качества и аккуратности.",
                img: IMAGES.designer[0]
              },
              {
                title: "Клининг коммерческих помещений",
                desc: "Офисы, рестораны и объекты с повышенными требованиями к внешнему виду и порядку.",
                img: IMAGES.office
              }
            ].map((service, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="aspect-[16/10] rounded-3xl overflow-hidden mb-8">
                  <img 
                    src={service.img} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-3xl mb-4">{service.title}</h3>
                <p className="text-brand-ink/60 font-light leading-relaxed max-w-md">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Additional Services --- */}
      <section className="bg-brand-ink text-white overflow-hidden">
        <div className="section-padding grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <SectionTitle 
              title="Дополнительные услуги" 
              subtitle="Помогаем довести объект до полностью завершённого состояния, когда не нужно искать отдельных подрядчиков под каждую задачу."
              light
            />
            
            <div className="grid sm:grid-cols-2 gap-8">
              {[
                { title: "Мойка окон", icon: <Wind size={24} /> },
                { title: "Химчистка мебели", icon: <Droplets size={24} /> },
                { title: "Химчистка матрасов", icon: <Layers size={24} /> },
                { title: "Глубокая очистка полов", icon: <Maximize size={24} /> }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="text-brand-accent">{item.icon}</div>
                  <span className="text-sm uppercase tracking-widest font-light">{item.title}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-12">
              <Button variant="white" onClick={scrollToForm}>
                Оставить заявку
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-full border border-white/10 p-12 flex items-center justify-center">
              <div className="aspect-square rounded-full border border-white/20 p-12 flex items-center justify-center">
                <img 
                  src={IMAGES.commercial} 
                  alt="Commercial Cleaning" 
                  className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-accent/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-accent/20 blur-3xl rounded-full" />
          </div>
        </div>
      </section>

      {/* --- Why Choose Us --- */}
      <section className="bg-white">
        <div className="section-padding">
          <SectionTitle title="Почему выбирают Алхимик" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              {
                title: "Аккуратная работа",
                desc: "Понимаем, что премиальные интерьеры требуют не спешки, а точности и бережности."
              },
              {
                title: "Опытная команда",
                desc: "Работаем с объектами разного уровня сложности — от частных до статусных пространств."
              },
              {
                title: "Проф. техника",
                desc: "Используем оборудование и средства, которые позволяют работать эффективно и предсказуемо."
              },
              {
                title: "Деликатные материалы",
                desc: "Учитываем особенности камня, стекла, дерева, текстиля и других чувствительных поверхностей."
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <span className="text-5xl font-serif text-brand-accent/20 block mb-6">0{idx + 1}</span>
                <h3 className="text-xl mb-4 font-medium">{item.title}</h3>
                <p className="text-brand-ink/60 font-light text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Gallery --- */}
      <section className="bg-brand-bg">
        <div className="section-padding">
          <SectionTitle 
            title="Наши объекты" 
            subtitle="Показываем не обещания, а результат работы на разных типах помещений"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 aspect-[16/9] rounded-3xl overflow-hidden group relative">
              <img src={IMAGES.designer[1]} alt="Apartment" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute bottom-8 left-8 text-white">
                <span className="text-[10px] uppercase tracking-widest bg-brand-ink/40 backdrop-blur px-3 py-1 rounded-full">Квартиры</span>
              </div>
            </div>
            <div className="aspect-square rounded-3xl overflow-hidden group relative">
              <img src={IMAGES.renovation[1]} alt="House" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute bottom-8 left-8 text-white">
                <span className="text-[10px] uppercase tracking-widest bg-brand-ink/40 backdrop-blur px-3 py-1 rounded-full">Дома</span>
              </div>
            </div>
            <div className="aspect-square rounded-3xl overflow-hidden group relative">
              <img src={IMAGES.office} alt="Office" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute bottom-8 left-8 text-white">
                <span className="text-[10px] uppercase tracking-widest bg-brand-ink/40 backdrop-blur px-3 py-1 rounded-full">Офисы</span>
              </div>
            </div>
            <div className="lg:col-span-2 aspect-[16/9] rounded-3xl overflow-hidden group relative">
              <img src={IMAGES.designer[2]} alt="Designer Interior" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute bottom-8 left-8 text-white">
                <span className="text-[10px] uppercase tracking-widest bg-brand-ink/40 backdrop-blur px-3 py-1 rounded-full">Дизайнерские интерьеры</span>
              </div>
            </div>
          </div>

          <div className="mt-24">
            <h3 className="text-3xl mb-12 text-center">Формат До / После</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {IMAGES.beforeAfter.map((img, idx) => (
                <div key={idx} className="rounded-3xl overflow-hidden border border-brand-muted">
                  <img src={img} alt={`Before After ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Contact Form --- */}
      <section id="contact-form" className="bg-white">
        <div className="section-padding grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-7xl mb-8">Нужна уборка?</h2>
            <p className="text-lg text-brand-ink/60 font-light mb-12 leading-relaxed max-w-lg">
              Опишите задачу или отправьте фото помещения. Мы свяжемся с вами, уточним детали и предложим подходящее решение под ваш объект.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center text-brand-accent">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-brand-ink/40">Телефон</p>
                  <p className="text-lg font-medium">{CONTACTS.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center text-brand-accent">
                  <Send size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-brand-ink/40">Telegram</p>
                  <a href={CONTACTS.telegram} className="text-lg font-medium hover:text-brand-accent transition-colors">@{CONTACTS.tgNick}</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-10 md:p-16 rounded-[40px] bg-brand-bg border border-brand-muted">
            <Form />
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-brand-ink text-white/40 py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-2">
              <div className="flex flex-col mb-8">
                <span className="text-3xl font-serif tracking-widest uppercase text-white">Алхимик</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 -mt-1">Premium Cleaning</span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed">
                Профессиональный клининг премиального уровня в Санкт-Петербурге. Работаем с 2018 года.
              </p>
            </div>
            
            <div>
              <h4 className="text-white text-xs uppercase tracking-widest mb-8">Контакты</h4>
              <ul className="space-y-4 text-sm">
                <li>{CONTACTS.phone}</li>
                <li><a href={CONTACTS.telegram} className="hover:text-white transition-colors">@{CONTACTS.tgNick}</a></li>
                <li>{CONTACTS.address}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-xs uppercase tracking-widest mb-8">Услуги</h4>
              <ul className="space-y-4 text-sm">
                <li>Уборка после ремонта</li>
                <li>Генеральная уборка</li>
                <li>Мойка окон</li>
                <li>Химчистка</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-widest">
            <p>© 2026 Алхимик. Все права защищены.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-white transition-colors">Публичная оферта</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
