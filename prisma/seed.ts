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

  console.log('✅ Database seeded successfully!');
  console.log({ webDev, blockchain, gamefi, finance, gamesReviews, nftAssets, defi, trading });

  // Check if posts already exist (skip seeding if they do)
  const existingPosts = await prisma.blogPost.count();
  if (existingPosts > 0) {
    console.log(`⏭️  Skipping post seeding - ${existingPosts} posts already exist`);
    return;
  }
  
  console.log('📝 Seeding blog posts...');

  // Rich content (EN)
  const richContentEn = `
    <h2>Tokenomics: How the Web3 Project Economy Works</h2>
    <p>Tokenomics (from token and economy) is the economics of a token — the rules by which a digital asset lives and develops within a blockchain project. It determines why the token exists, how it is issued, who receives it, how it is used, and what affects its price.</p>
    <p>If a regular currency has a state and central bank, a token has a smart contract and a project community that manage the entire system.</p>

    <h2>Why Tokenomics Matters</h2>
    <p>Any token is created not just "to exist." It solves a specific problem:</p>
    <ul>
      <li>pays for services within the project (utility token),</li>
      <li>gives voting rights in governance (governance token),</li>
      <li>serves as collateral or reward (staking token),</li>
      <li>or represents an ownership share (security token).</li>
    </ul>
    <p>Good tokenomics makes a token valuable and useful, bad tokenomics turns it into useless speculation.</p>

    <h2>Key Elements of Tokenomics</h2>
    
    <h3>💰 Emission</h3>
    <p>How many tokens will be issued and on what schedule. Can be fixed (like Bitcoin — 21 million coins) or inflationary (like Ethereum after transitioning to PoS). This determines scarcity and potential token value.</p>

    <h3>🔄 Distribution</h3>
    <p>Who receives tokens and on what terms: investors, team, development fund, users (through airdrop or mining). The distribution structure determines the balance of power and interests in the ecosystem.</p>

    <h3>🧩 Circulation Mechanics</h3>
    <p>How tokens move through the system. For example:</p>
    <ul>
      <li>what they pay for;</li>
      <li>where they can be used;</li>
      <li>whether they are burned (to reduce supply);</li>
      <li>whether they can be staked for yield.</li>
    </ul>

    <h3>📈 Incentives and Participant Behavior</h3>
    <p>Good tokenomics creates motivation for participation — holding the token is profitable, and selling is unappealing. If incentives are poorly structured, the token depreciates, the project loses interest and trust.</p>

    <h2>Conclusion</h2>
    <p>Tokenomics is not just about tokens. It's about a system of values, incentives, and trust embedded in code. The fate of a project depends on how well it's designed: whether it becomes an ecosystem — or remains a set of digital wrappers.</p>
  `;

  // Rich content (RU)
  const richContentRu = `
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

  // Multilingual posts — one post = both languages
  const posts = [
    // Games & Reviews posts (4 posts)
    {
      title: 'Tokenomics: How the Web3 Project Economy Works',
      titleRu: 'Токеномика: как устроена экономика Web3-проектов',
      slug: 'tokenomics-web3-economy',
      excerpt: 'Where tokens come from, why they grow in price, and why they matter even for non-traders',
      excerptRu: 'Откуда берутся токены, почему они растут в цене и зачем нужны даже тем, кто не торгует криптой',
      content: richContentEn,
      contentRu: richContentRu,
      categoryId: gamesReviews.id,
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80',
    },
    {
      title: 'Play-to-Earn Gaming Revolution',
      titleRu: 'Революция Play-to-Earn в игровой индустрии',
      slug: 'play-to-earn-gaming-revolution',
      excerpt: 'How blockchain is transforming the gaming industry with new economic models',
      excerptRu: 'Как блокчейн трансформирует игровую индустрию с новыми экономическими моделями',
      content: richContentEn,
      contentRu: richContentRu,
      categoryId: gamesReviews.id,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80',
    },
    {
      title: 'Top 10 GameFi Projects 2026',
      titleRu: 'Топ-10 GameFi проектов 2026',
      slug: 'top-gamefi-projects-2026',
      excerpt: 'Comprehensive review of the best play-to-earn games and their tokenomics',
      excerptRu: 'Полный обзор лучших play-to-earn игр и их токеномики',
      content: richContentEn,
      contentRu: richContentRu,
      categoryId: gamesReviews.id,
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80',
    },
    {
      title: 'GameFi Tokenomics Breakdown',
      titleRu: 'Разбор токеномики GameFi',
      slug: 'gamefi-tokenomics-breakdown',
      excerpt: 'How gaming tokens create sustainable economies and drive player engagement',
      excerptRu: 'Как игровые токены создают устойчивые экономики и стимулируют вовлеченность игроков',
      content: richContentEn,
      contentRu: richContentRu,
      categoryId: gamesReviews.id,
      image: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=1200&q=80',
    },
    // NFT & Assets posts (4 posts)
    {
      title: 'NFT Gaming Assets Explained',
      titleRu: 'NFT игровые активы: полное руководство',
      slug: 'nft-gaming-assets-explained',
      excerpt: 'Understanding digital ownership in gaming and the future of in-game economies',
      excerptRu: 'Понимание цифровой собственности в играх и будущее внутриигровых экономик',
      content: richContentEn,
      contentRu: richContentRu,
      categoryId: nftAssets.id,
      image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=1200&q=80',
    },
    {
      title: 'Metaverse Economics Guide',
      titleRu: 'Гид по экономике метавселенных',
      slug: 'metaverse-economics-guide',
      excerpt: 'Economic models powering virtual worlds and digital real estate',
      excerptRu: 'Экономические модели, управляющие виртуальными мирами и цифровой недвижимостью',
      content: richContentEn,
      contentRu: richContentRu,
      categoryId: nftAssets.id,
      image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=1200&q=80',
    },
    {
      title: 'NFT Marketplaces Comparison',
      titleRu: 'Сравнение NFT маркетплейсов',
      slug: 'nft-marketplaces-comparison',
      excerpt: 'Comparing major NFT trading platforms and their unique features',
      excerptRu: 'Сравнение основных платформ для торговли NFT и их уникальных особенностей',
      content: richContentEn,
      contentRu: richContentRu,
      categoryId: nftAssets.id,
      image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=1200&q=80',
    },
    {
      title: 'In-Game Asset Valuation',
      titleRu: 'Оценка внутриигровых активов',
      slug: 'in-game-asset-valuation',
      excerpt: 'How to value digital gaming assets and NFTs in the metaverse',
      excerptRu: 'Как оценивать цифровые игровые активы и NFT в метавселенной',
      content: richContentEn,
      contentRu: richContentRu,
      categoryId: nftAssets.id,
      image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=1200&q=80',
    },
    // DeFi posts (4 posts)
    {
      title: 'DeFi Protocols Architecture',
      titleRu: 'Архитектура DeFi протоколов',
      slug: 'defi-protocols-architecture',
      excerpt: 'Understanding the architecture of decentralized finance protocols and smart contracts',
      excerptRu: 'Понимание архитектуры децентрализованных финансовых протоколов и смарт-контрактов',
      content: richContentEn,
      contentRu: richContentRu,
      categoryId: defi.id,
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80',
    },
    {
      title: 'Yield Farming Strategies 2026',
      titleRu: 'Стратегии yield farming 2026',
      slug: 'yield-farming-strategies-2026',
      excerpt: 'Modern approaches to maximizing DeFi yields and managing risk',
      excerptRu: 'Современные подходы к максимизации доходности в DeFi и управлению рисками',
      content: richContentEn,
      contentRu: richContentRu,
      categoryId: defi.id,
      image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=1200&q=80',
    },
    {
      title: 'Liquidity Mining Explained',
      titleRu: 'Ликвидность майнинг: подробное объяснение',
      slug: 'liquidity-mining-explained',
      excerpt: 'How to earn rewards by providing liquidity to decentralized exchanges',
      excerptRu: 'Как зарабатывать вознаграждения, предоставляя ликвидность децентрализованным биржам',
      content: richContentEn,
      contentRu: richContentRu,
      categoryId: defi.id,
      image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=1200&q=80',
    },
    {
      title: 'DeFi Security Best Practices',
      titleRu: 'Лучшие практики безопасности в DeFi',
      slug: 'defi-security-best-practices',
      excerpt: 'Protecting your assets in decentralized finance from hacks and exploits',
      excerptRu: 'Защита ваших активов в децентрализованных финансах от взломов и эксплойтов',
      content: richContentEn,
      contentRu: richContentRu,
      categoryId: defi.id,
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80',
    },
    // Trading posts (4 posts)
    {
      title: 'Stablecoin Mechanisms Explained',
      titleRu: 'Механизмы стейблкоинов: полное объяснение',
      slug: 'stablecoin-mechanisms-explained',
      excerpt: 'How different stablecoins maintain their peg to fiat currencies',
      excerptRu: 'Как различные стейблкоины поддерживают привязку к фиатным валютам',
      content: richContentEn,
      contentRu: richContentRu,
      categoryId: trading.id,
      image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=1200&q=80',
    },
    {
      title: 'Liquidity Pools Deep Dive',
      titleRu: 'Пулы ликвидности: глубокое погружение',
      slug: 'liquidity-pools-deep-dive',
      excerpt: 'Understanding automated market makers and liquidity provision mechanisms',
      excerptRu: 'Понимание автоматизированных маркет-мейкеров и механизмов предоставления ликвидности',
      content: richContentEn,
      contentRu: richContentRu,
      categoryId: trading.id,
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80',
    },
    {
      title: 'Crypto Trading Strategies',
      titleRu: 'Стратегии криптотрейдинга',
      slug: 'crypto-trading-strategies',
      excerpt: 'Proven strategies for cryptocurrency trading in volatile markets',
      excerptRu: 'Проверенные стратегии для торговли криптовалютами на волатильных рынках',
      content: richContentEn,
      contentRu: richContentRu,
      categoryId: trading.id,
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
    },
    {
      title: 'Technical Analysis for Crypto',
      titleRu: 'Технический анализ для крипты',
      slug: 'technical-analysis-crypto',
      excerpt: 'Using technical indicators and chart patterns in cryptocurrency markets',
      excerptRu: 'Использование технических индикаторов и графических паттернов на криптовалютных рынках',
      content: richContentEn,
      contentRu: richContentRu,
      categoryId: trading.id,
      image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&q=80',
    },
    // Blockchain category posts (4 posts)
    {
      title: 'Blockchain Technology Basics',
      titleRu: 'Основы блокчейн технологии',
      slug: 'blockchain-basics',
      excerpt: 'Introduction to blockchain: how distributed ledgers work and why it matters',
      excerptRu: 'Введение в блокчейн: как работает распределенный реестр и почему это важно',
      content: richContentEn,
      contentRu: richContentRu,
      categoryId: blockchain.id,
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80',
    },
    {
      title: 'Smart Contracts: A Beginner\'s Guide',
      titleRu: 'Смарт-контракты: руководство для начинающих',
      slug: 'smart-contracts-guide',
      excerpt: 'What smart contracts are and how they are changing the way deals are made',
      excerptRu: 'Что такое смарт-контракты и как они меняют способ заключения сделок',
      content: richContentEn,
      contentRu: richContentRu,
      categoryId: blockchain.id,
      image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=1200&q=80',
    },
    {
      title: 'Consensus Mechanisms in Blockchain',
      titleRu: 'Консенсус механизмы в блокчейне',
      slug: 'consensus-mechanisms',
      excerpt: 'PoW, PoS, and other consensus mechanisms in distributed networks',
      excerptRu: 'PoW, PoS и другие механизмы достижения консенсуса в распределенных сетях',
      content: richContentEn,
      contentRu: richContentRu,
      categoryId: blockchain.id,
      image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=1200&q=80',
    },
    {
      title: 'The Future of Web3 and Decentralization',
      titleRu: 'Будущее Web3 и децентрализации',
      slug: 'web3-future',
      excerpt: 'How Web3 technologies will change the internet and digital economy',
      excerptRu: 'Как Web3 технологии изменят интернет и цифровую экономику',
      content: richContentEn,
      contentRu: richContentRu,
      categoryId: blockchain.id,
      image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=1200&q=80',
    },
  ];

  for (const postData of posts) {
    await prisma.blogPost.create({
      data: {
        title: postData.title,
        titleRu: postData.titleRu,
        slug: postData.slug,
        excerpt: postData.excerpt,
        excerptRu: postData.excerptRu,
        content: postData.content,
        contentRu: postData.contentRu,
        featuredImage: postData.image,
        published: true,
        publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        categoryId: postData.categoryId,
        views: Math.floor(Math.random() * 24) + 20,
      },
    });
  }

  console.log(`✅ Created ${posts.length} multilingual blog posts`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
