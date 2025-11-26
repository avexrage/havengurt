import React from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from './HeroSection';
import { QualitySection } from './QualitySection';
import { ProductSection } from './ProductSection';
import { StoryPreviewSection } from './StoryPreviewSection';
import { PartnersSection } from './PartnersSection';

export const Home = ({ cart, onAdd, onNavigate }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
        <HeroSection onNavigate={onNavigate} />
        <QualitySection />
        <ProductSection cart={cart} onAdd={onAdd} />
        <StoryPreviewSection onNavigate={onNavigate} />
        <PartnersSection />
    </motion.div>
);
