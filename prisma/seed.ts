import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create categories
  const webDev = await prisma.category.upsert({
    where: { slug: 'web-development' },
    update: {},
    create: {
      name: 'Web Development',
      nameRu: 'Веб-разработка',
      slug: 'web-development',
      description: 'Articles about web development, frameworks, and best practices',
      descriptionRu: 'Статьи о веб-разработке, фреймворках и лучших практиках',
    },
  });

  const blockchain = await prisma.category.upsert({
    where: { slug: 'blockchain' },
    update: {},
    create: {
      name: 'Blockchain',
      nameRu: 'Блокчейн',
      slug: 'blockchain',
      description: 'Blockchain technology, smart contracts, and Web3',
      descriptionRu: 'Технология блокчейн, смарт-контракты и Web3',
    },
  });

  const gamefi = await prisma.category.upsert({
    where: { slug: 'gamefi' },
    update: {},
    create: {
      name: 'GameFi',
      nameRu: 'GameFi',
      slug: 'gamefi',
      description: 'Gaming and blockchain intersection',
      descriptionRu: 'Игры и блокчейн',
    },
  });

  const finance = await prisma.category.upsert({
    where: { slug: 'finance' },
    update: {},
    create: {
      name: 'Finance',
      nameRu: 'Финансы',
      slug: 'finance',
      description: 'Financial technology and DeFi',
      descriptionRu: 'Финансовые технологии и DeFi',
    },
  });

  // Create subcategories for GameFi
  const gamesReviews = await prisma.category.upsert({
    where: { slug: 'games-reviews' },
    update: {},
    create: {
      name: 'Games & Reviews',
      nameRu: 'Игры и обзоры',
      slug: 'games-reviews',
      description: 'Game reviews and analysis',
      descriptionRu: 'Обзоры и анализ игр',
      parentId: gamefi.id,
    },
  });

  const nftAssets = await prisma.category.upsert({
    where: { slug: 'nft-assets' },
    update: {},
    create: {
      name: 'NFT & In-game Assets',
      nameRu: 'NFT и внутриигровые активы',
      slug: 'nft-assets',
      description: 'NFTs and gaming assets',
      descriptionRu: 'NFT и игровые активы',
      parentId: gamefi.id,
    },
  });

  // Create subcategories for Finance
  const defi = await prisma.category.upsert({
    where: { slug: 'defi' },
    update: {},
    create: {
      name: 'DeFi',
      nameRu: 'DeFi',
      slug: 'defi',
      description: 'Decentralized Finance',
      descriptionRu: 'Децентрализованные финансы',
      parentId: finance.id,
    },
  });

  const trading = await prisma.category.upsert({
    where: { slug: 'trading' },
    update: {},
    create: {
      name: 'Trading',
      nameRu: 'Трейдинг',
      slug: 'trading',
      description: 'Trading strategies and analysis',
      descriptionRu: 'Торговые стратегии и анализ',
      parentId: finance.id,
    },
  });

  // Create tags
  const nextjsTag = await prisma.tag.upsert({
    where: { slug: 'nextjs' },
    update: {},
    create: {
      name: 'Next.js',
      nameRu: 'Next.js',
      slug: 'nextjs',
    },
  });

  const reactTag = await prisma.tag.upsert({
    where: { slug: 'react' },
    update: {},
    create: {
      name: 'React',
      nameRu: 'React',
      slug: 'react',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log({ webDev, blockchain, gamefi, finance, gamesReviews, nftAssets, defi, trading, nextjsTag, reactTag });

  // Delete old posts first
  await prisma.blogPost.deleteMany({});
  console.log('🗑️  Deleted old posts');

  // Create multiple blog posts for different subcategories
  const richContent = `
    <h2>Токеномика: как устроена экономика Web3-проектов</h2>
    <p>Токеномика (от token и economy) — это экономика токена, то есть правила, по которым живёт и развивается цифровой актив в рамках блокчейн-проекта. Она определяет, зачем токен существует, как он выпускается, кому достаётся, как используется и что влияет на его цену.</p>
    <p>Если у обычной валюты есть государство и центральный банк, то у токена — смарт-контракт и сообщество проекта, которые управляют всей системой.</p>

    <h2>Зачем нужна токеномика</h2>
    <p>Любой токен создаётся не просто «чтобы был». Он решает конкретную задачу:</p>
    <ul>
      <li>оплачивает услуги внутри проекта (utility token),</li>
      <li>даёт право голоса в управлении (governance token),</li>
      <li>служит залогом или вознаграждением (staking token),</li>
      <li>либо представляет долю собственности (security token).</li>
    </ul>
    <p>Хорошая токеномика делает токен ценным и полезным, плохая — превращает его в бесполезную спекуляцию.</p>

    <h2>Основные элементы токеномики</h2>
    
    <h3>💰 Эмиссия</h3>
    <p>Сколько токенов будет выпущено и по какому графику. Может быть фиксированной (как у Bitcoin — 21 млн монет) или инфляционной (как у Ethereum после перехода на PoS). От этого зависит дефицит и потенциальная ценность токена.</p>

    <h3>🔄 Распределение</h3>
    <p>Кто получает токены и на каких условиях: инвесторы, команда, фонд развития, пользователи (через airdrop или майнинг). От того, как устроено распределение, зависит баланс власти и интересов в экосистеме.</p>

    <h3>🧩 Механика обращения</h3>
    <p>Как токены двигаются по системе. Например:</p>
    <ul>
      <li>за что ими платят;</li>
      <li>где их можно использовать;</li>
      <li>сжигаются ли они (чтобы снижать предложение);</li>
      <li>можно ли их стейкать и получать доход.</li>
    </ul>

    <h3>📈 Стимулы и поведение участников</h3>
    <p>Хорошая токеномика создаёт мотивы для участия — держать токен выгодно, а продавать не хочется. Если стимулы выстроены плохо, токен обесценивается, проект теряет интерес и доверие.</p>

    <h2>Вывод</h2>
    <p>Токеномика — это не просто про токены. Это про систему ценностей, стимулов и доверия, встроенную в код. От того, насколько грамотно она выстроена, зависит судьба проекта: станет ли он экосистемой — или останется набором цифровых фантиков.</p>
  `;

  const posts = [
    // Games & Reviews posts (4 posts)
    {
      title: 'Токеномика: как устроена экономика Web3-проектов',
      slug: 'tokenomics-web3-economy',
      excerpt: 'Откуда берутся токены, почему они растут в цене и зачем нужны даже тем, кто не торгует криптой',
      content: richContent,
      categoryId: gamesReviews.id,
      tags: [reactTag.id],
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80',
    },
    {
      title: 'Play-to-Earn Gaming Revolution',
      slug: 'play-to-earn-gaming-revolution',
      excerpt: 'How blockchain is transforming the gaming industry with new economic models',
      content: richContent,
      categoryId: gamesReviews.id,
      tags: [nextjsTag.id],
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80',
    },
    {
      title: 'Top 10 GameFi Projects 2026',
      slug: 'top-gamefi-projects-2026',
      excerpt: 'Comprehensive review of the best play-to-earn games and their tokenomics',
      content: richContent,
      categoryId: gamesReviews.id,
      tags: [reactTag.id, nextjsTag.id],
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80',
    },
    {
      title: 'GameFi Tokenomics Breakdown',
      slug: 'gamefi-tokenomics-breakdown',
      excerpt: 'How gaming tokens create sustainable economies and drive player engagement',
      content: richContent,
      categoryId: gamesReviews.id,
      tags: [reactTag.id],
      image: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=1200&q=80',
    },
    // NFT & Assets posts (4 posts)
    {
      title: 'NFT Gaming Assets Explained',
      slug: 'nft-gaming-assets-explained',
      excerpt: 'Understanding digital ownership in gaming and the future of in-game economies',
      content: richContent,
      categoryId: nftAssets.id,
      tags: [reactTag.id],
      image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=1200&q=80',
    },
    {
      title: 'Metaverse Economics Guide',
      slug: 'metaverse-economics-guide',
      excerpt: 'Economic models powering virtual worlds and digital real estate',
      content: richContent,
      categoryId: nftAssets.id,
      tags: [nextjsTag.id, reactTag.id],
      image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=1200&q=80',
    },
    {
      title: 'NFT Marketplaces Comparison',
      slug: 'nft-marketplaces-comparison',
      excerpt: 'Comparing major NFT trading platforms and their unique features',
      content: richContent,
      categoryId: nftAssets.id,
      tags: [reactTag.id],
      image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=1200&q=80',
    },
    {
      title: 'In-Game Asset Valuation',
      slug: 'in-game-asset-valuation',
      excerpt: 'How to value digital gaming assets and NFTs in the metaverse',
      content: richContent,
      categoryId: nftAssets.id,
      tags: [nextjsTag.id],
      image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=1200&q=80',
    },
    // DeFi posts (4 posts)
    {
      title: 'DeFi Protocols Architecture',
      slug: 'defi-protocols-architecture',
      excerpt: 'Understanding the architecture of decentralized finance protocols and smart contracts',
      content: richContent,
      categoryId: defi.id,
      tags: [reactTag.id],
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80',
    },
    {
      title: 'Yield Farming Strategies 2026',
      slug: 'yield-farming-strategies-2026',
      excerpt: 'Modern approaches to maximizing DeFi yields and managing risk',
      content: richContent,
      categoryId: defi.id,
      tags: [nextjsTag.id],
      image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=1200&q=80',
    },
    {
      title: 'Liquidity Mining Explained',
      slug: 'liquidity-mining-explained',
      excerpt: 'How to earn rewards by providing liquidity to decentralized exchanges',
      content: richContent,
      categoryId: defi.id,
      tags: [reactTag.id, nextjsTag.id],
      image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=1200&q=80',
    },
    {
      title: 'DeFi Security Best Practices',
      slug: 'defi-security-best-practices',
      excerpt: 'Protecting your assets in decentralized finance from hacks and exploits',
      content: richContent,
      categoryId: defi.id,
      tags: [reactTag.id],
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80',
    },
    // Trading posts (4 posts)
    {
      title: 'Stablecoin Mechanisms Explained',
      slug: 'stablecoin-mechanisms-explained',
      excerpt: 'How different stablecoins maintain their peg to fiat currencies',
      content: richContent,
      categoryId: trading.id,
      tags: [reactTag.id],
      image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=1200&q=80',
    },
    {
      title: 'Liquidity Pools Deep Dive',
      slug: 'liquidity-pools-deep-dive',
      excerpt: 'Understanding automated market makers and liquidity provision mechanisms',
      content: richContent,
      categoryId: trading.id,
      tags: [nextjsTag.id, reactTag.id],
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80',
    },
    {
      title: 'Crypto Trading Strategies',
      slug: 'crypto-trading-strategies',
      excerpt: 'Proven strategies for cryptocurrency trading in volatile markets',
      content: richContent,
      categoryId: trading.id,
      tags: [reactTag.id],
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
    },
    {
      title: 'Technical Analysis for Crypto',
      slug: 'technical-analysis-crypto',
      excerpt: 'Using technical indicators and chart patterns in cryptocurrency markets',
      content: richContent,
      categoryId: trading.id,
      tags: [nextjsTag.id],
      image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&q=80',
    },
  ];

  for (const postData of posts) {
    await prisma.blogPost.create({
      data: {
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        content: postData.content,
        featuredImage: postData.image,
        published: true,
        publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        locale: 'en',
        categoryId: postData.categoryId,
        tags: {
          connect: postData.tags.map(id => ({ id })),
        },
      },
    });
  }

  console.log(`✅ Created ${posts.length} blog posts`);

  // Create Russian locale posts
  const russianPosts = [
    // Games & Reviews posts (4 posts) - RU
    {
      title: 'Токеномика: как устроена экономика Web3-проектов',
      slug: 'tokenomics-web3-economy-ru',
      excerpt: 'Откуда берутся токены, почему они растут в цене и зачем нужны даже тем, кто не торгует криптой',
      content: richContent,
      categoryId: gamesReviews.id,
      tags: [reactTag.id],
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80',
    },
    {
      title: 'Революция Play-to-Earn в игровой индустрии',
      slug: 'play-to-earn-gaming-revolution-ru',
      excerpt: 'Как блокчейн трансформирует игровую индустрию с новыми экономическими моделями',
      content: richContent,
      categoryId: gamesReviews.id,
      tags: [nextjsTag.id],
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80',
    },
    {
      title: 'Топ-10 GameFi проектов 2026',
      slug: 'top-gamefi-projects-2026-ru',
      excerpt: 'Полный обзор лучших play-to-earn игр и их токеномики',
      content: richContent,
      categoryId: gamesReviews.id,
      tags: [reactTag.id, nextjsTag.id],
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80',
    },
    {
      title: 'Разбор токеномики GameFi',
      slug: 'gamefi-tokenomics-breakdown-ru',
      excerpt: 'Как игровые токены создают устойчивые экономики и стимулируют вовлеченность игроков',
      content: richContent,
      categoryId: gamesReviews.id,
      tags: [reactTag.id],
      image: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=1200&q=80',
    },
    // NFT & Assets posts (4 posts) - RU
    {
      title: 'NFT игровые активы: полное руководство',
      slug: 'nft-gaming-assets-explained-ru',
      excerpt: 'Понимание цифровой собственности в играх и будущее внутриигровых экономик',
      content: richContent,
      categoryId: nftAssets.id,
      tags: [reactTag.id],
      image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=1200&q=80',
    },
    {
      title: 'Гид по экономике метавселенных',
      slug: 'metaverse-economics-guide-ru',
      excerpt: 'Экономические модели, управляющие виртуальными мирами и цифровой недвижимостью',
      content: richContent,
      categoryId: nftAssets.id,
      tags: [nextjsTag.id, reactTag.id],
      image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=1200&q=80',
    },
    {
      title: 'Сравнение NFT маркетплейсов',
      slug: 'nft-marketplaces-comparison-ru',
      excerpt: 'Сравнение основных платформ для торговли NFT и их уникальных особенностей',
      content: richContent,
      categoryId: nftAssets.id,
      tags: [reactTag.id],
      image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=1200&q=80',
    },
    {
      title: 'Оценка внутриигровых активов',
      slug: 'in-game-asset-valuation-ru',
      excerpt: 'Как оценивать цифровые игровые активы и NFT в метавселенной',
      content: richContent,
      categoryId: nftAssets.id,
      tags: [nextjsTag.id],
      image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=1200&q=80',
    },
    // DeFi posts (4 posts) - RU
    {
      title: 'Архитектура DeFi протоколов',
      slug: 'defi-protocols-architecture-ru',
      excerpt: 'Понимание архитектуры децентрализованных финансовых протоколов и смарт-контрактов',
      content: richContent,
      categoryId: defi.id,
      tags: [reactTag.id],
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80',
    },
    {
      title: 'Стратегии yield farming 2026',
      slug: 'yield-farming-strategies-2026-ru',
      excerpt: 'Современные подходы к максимизации доходности в DeFi и управлению рисками',
      content: richContent,
      categoryId: defi.id,
      tags: [nextjsTag.id],
      image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=1200&q=80',
    },
    {
      title: 'Ликвидность майнинг: подробное объяснение',
      slug: 'liquidity-mining-explained-ru',
      excerpt: 'Как зарабатывать вознаграждения, предоставляя ликвидность децентрализованным биржам',
      content: richContent,
      categoryId: defi.id,
      tags: [reactTag.id, nextjsTag.id],
      image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=1200&q=80',
    },
    {
      title: 'Лучшие практики безопасности в DeFi',
      slug: 'defi-security-best-practices-ru',
      excerpt: 'Защита ваших активов в децентрализованных финансах от взломов и эксплойтов',
      content: richContent,
      categoryId: defi.id,
      tags: [reactTag.id],
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80',
    },
    // Trading posts (4 posts) - RU
    {
      title: 'Механизмы стейблкоинов: полное объяснение',
      slug: 'stablecoin-mechanisms-explained-ru',
      excerpt: 'Как различные стейблкоины поддерживают привязку к фиатным валютам',
      content: richContent,
      categoryId: trading.id,
      tags: [reactTag.id],
      image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=1200&q=80',
    },
    {
      title: 'Пулы ликвидности: глубокое погружение',
      slug: 'liquidity-pools-deep-dive-ru',
      excerpt: 'Понимание автоматизированных маркет-мейкеров и механизмов предоставления ликвидности',
      content: richContent,
      categoryId: trading.id,
      tags: [nextjsTag.id, reactTag.id],
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80',
    },
    {
      title: 'Стратегии криптотрейдинга',
      slug: 'crypto-trading-strategies-ru',
      excerpt: 'Проверенные стратегии для торговли криптовалютами на волатильных рынках',
      content: richContent,
      categoryId: trading.id,
      tags: [reactTag.id],
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
    },
    {
      title: 'Технический анализ для крипты',
      slug: 'technical-analysis-crypto-ru',
      excerpt: 'Использование технических индикаторов и графических паттернов на криптовалютных рынках',
      content: richContent,
      categoryId: trading.id,
      tags: [nextjsTag.id],
      image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&q=80',
    },
    // Blockchain category posts (4 posts) - RU
    {
      title: 'Основы блокчейн технологии',
      slug: 'blockchain-basics-ru',
      excerpt: 'Введение в блокчейн: как работает распределенный реестр и почему это важно',
      content: richContent,
      categoryId: blockchain.id,
      tags: [reactTag.id],
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80',
    },
    {
      title: 'Смарт-контракты: руководство для начинающих',
      slug: 'smart-contracts-guide-ru',
      excerpt: 'Что такое смарт-контракты и как они меняют способ заключения сделок',
      content: richContent,
      categoryId: blockchain.id,
      tags: [nextjsTag.id, reactTag.id],
      image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=1200&q=80',
    },
    {
      title: 'Консенсус механизмы в блокчейне',
      slug: 'consensus-mechanisms-ru',
      excerpt: 'PoW, PoS и другие механизмы достижения консенсуса в распределенных сетях',
      content: richContent,
      categoryId: blockchain.id,
      tags: [reactTag.id],
      image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=1200&q=80',
    },
    {
      title: 'Будущее Web3 и децентрализации',
      slug: 'web3-future-ru',
      excerpt: 'Как Web3 технологии изменят интернет и цифровую экономику',
      content: richContent,
      categoryId: blockchain.id,
      tags: [nextjsTag.id],
      image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=1200&q=80',
    },
  ];

  for (const postData of russianPosts) {
    await prisma.blogPost.create({
      data: {
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        content: postData.content,
        featuredImage: postData.image,
        published: true,
        publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        locale: 'ru',
        categoryId: postData.categoryId,
        tags: {
          connect: postData.tags.map(id => ({ id })),
        },
      },
    });
  }

  console.log(`✅ Created ${russianPosts.length} Russian blog posts`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
