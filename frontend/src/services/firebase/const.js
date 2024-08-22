//src/services/firebase/const.js

export const categories = {
    'fantasia': [
        'dragon', 'magic', 'wizard', 'witch', 'orc', 'elf', 'dwarf', 'castle', 'sword', 'spell', 'kingdom',
        'quest', 'dragão', 'magia', 'feiticeiro', 'bruxa', 'anão', 'elfo', 'castelo', 'espada', 'reino', 'missão',
        'fairy', 'troll', 'goblin', 'knight', 'unicorn', 'phoenix', 'sorcery', 'runes', 'potion', 'medieval'
    ],
    'programação': [
        'python', 'code', 'algorithm', 'fibonacci', 'variable', 'function', 'loop', 'recursion', 'database',
        'query', 'API', 'framework', 'bug', 'debug', 'compilation', 'java', 'c++', 'javascript', 'html', 'css',
        'código', 'variável', 'função', 'laço', 'recursão', 'banco de dados', 'typescript', 'git', 'docker',
        'microservices', 'cloud computing', 'devops', 'continuous integration', 'unit test', 'refactoring'
    ],
    'tecnologia': [
        'computer', 'AI', 'software', 'hardware', 'tecnologia', 'gadget', 'cloud', 'internet', 'network',
        'cybersecurity', 'encryption', 'robotics', 'machine learning', 'blockchain', 'mobile', 'smartphone',
        'iot', 'data', 'computador', 'inteligência artificial', 'rede', 'cibersegurança', 'criptografia',
        'robótica', 'aprendizado de máquina', 'quantum computing', 'augmented reality', 'virtual reality',
        '5G', 'wearable', 'tech trends'
    ],
    'saúde': [
        'medicine', 'doctor', 'health', 'hospital', 'surgery', 'nurse', 'therapy', 'pharmacy', 'diagnosis',
        'treatment', 'vaccine', 'virus', 'infection', 'disease', 'epidemic', 'pandemic', 'mental health',
        'wellness', 'nutrition', 'exercise', 'fitness', 'medicina', 'médico', 'hospital', 'cirurgia', 'enfermeiro',
        'terapia', 'farmácia', 'diagnóstico', 'tratamento', 'vacina', 'vírus', 'doença', 'epidemia', 'pandemia',
        'saúde mental', 'bem-estar', 'nutrição', 'exercício', 'fitness', 'telemedicine', 'public health', 'genetics',
        'chronic disease', 'diet', 'cardiology', 'oncology', 'immunology'
    ],
    'finanças': [
        'money', 'bank', 'investment', 'finanças', 'economy', 'market', 'stock', 'crypto', 'bitcoin',
        'budget', 'loan', 'mortgage', 'interest', 'tax', 'revenue', 'profit', 'loss', 'credit', 'debt',
        'payment', 'financeiro', 'banco', 'investimento', 'economia', 'mercado', 'ações', 'criptomoeda',
        'orçamento', 'empréstimo', 'hipoteca', 'juros', 'imposto', 'receita', 'lucro', 'perda', 'crédito',
        'dívida', 'pagamento', 'retirement', 'pension', 'mutual fund', 'financial planning', 'forex', 'fintech',
        'portfolio', 'stock exchange'
    ],
    'educação': [
        'school', 'university', 'college', 'study', 'homework', 'degree', 'course', 'lecture', 'teacher',
        'professor', 'exam', 'test', 'class', 'education', 'learning', 'online learning', 'scholarship',
        'student', 'curriculum', 'educação', 'escola', 'universidade', 'faculdade', 'estudo', 'tarefa',
        'curso', 'aula', 'professor', 'exame', 'teste', 'classe', 'aprendizagem', 'ensino online',
        'bolsa de estudos', 'aluno', 'currículo', 'pedagogy', 'e-learning', 'remote learning', 'special education',
        'STEM', 'higher education'
    ],
    'entretenimento': [
        'movie', 'film', 'tv', 'series', 'music', 'concert', 'artist', 'actor', 'actress', 'celebrity',
        'game', 'video game', 'theater', 'festival', 'comedy', 'drama', 'action', 'fantasy', 'horror', 'romance',
        'animation', 'filme', 'cinema', 'série', 'música', 'concerto', 'artista', 'ator', 'atriz', 'celebridade',
        'jogo', 'videogame', 'teatro', 'festival', 'comédia', 'drama', 'ação', 'fantasia', 'terror', 'romance',
        'animação', 'reality show', 'streaming', 'award', 'celebrity gossip', 'concert tour'
    ],
    'esportes': [
        'soccer', 'football', 'basketball', 'tennis', 'athlete', 'olympics', 'game', 'match', 'tournament',
        'championship', 'league', 'coach', 'team', 'goal', 'score', 'win', 'lose', 'player', 'referee',
        'esportes', 'futebol', 'basquete', 'tênis', 'atleta', 'olimpíadas', 'jogo', 'partida', 'torneio',
        'campeonato', 'liga', 'treinador', 'equipe', 'gol', 'placar', 'vitória', 'derrota', 'jogador', 'árbitro',
        'baseball', 'cricket', 'hockey', 'golf', 'swimming', 'marathon', 'boxing', 'MMA', 'racing'
    ],
    'viagens': [
        'travel', 'vacation', 'flight', 'hotel', 'tourism', 'beach', 'mountain', 'adventure', 'backpacking',
        'cruise', 'destination', 'passport', 'visa', 'trip', 'explore', 'city', 'country', 'guide', 'tour',
        'viagem', 'férias', 'voo', 'hotel', 'turismo', 'praia', 'montanha', 'aventura', 'mochilão', 'cruzeiro',
        'destino', 'passaporte', 'visto', 'explorar', 'cidade', 'país', 'guia', 'tour', 'itinerary', 'road trip',
        'luxury travel', 'budget travel', 'travel insurance', 'holiday', 'airline', 'tourist attraction'
    ],
    'alimentos': [
        'food', 'cuisine', 'recipe', 'cooking', 'chef', 'restaurant', 'dinner', 'breakfast', 'lunch',
        'snack', 'dessert', 'drink', 'wine', 'beverage', 'gourmet', 'baking', 'ingredient', 'meal', 'nutrition',
        'alimento', 'cozinha', 'receita', 'cozinhar', 'chefe', 'restaurante', 'jantar', 'café da manhã',
        'almoço', 'lanche', 'sobremesa', 'bebida', 'vinho', 'gourmet', 'assar', 'ingrediente', 'refeição',
        'nutrição', 'vegan', 'organic food', 'fast food', 'food blog', 'fine dining', 'cooking show',
        'recipe book', 'meal prep', 'diet'
    ],
    'política': [
        'government', 'election', 'president', 'law', 'policy', 'vote', 'congress', 'senate', 'minister',
        'party', 'campaign', 'democracy', 'republic', 'monarchy', 'dictatorship', 'rights', 'freedom',
        'constitution', 'politician', 'politics', 'governo', 'eleição', 'presidente', 'lei', 'política',
        'voto', 'congresso', 'senado', 'ministro', 'partido', 'campanha', 'democracia', 'república',
        'monarquia', 'ditadura', 'direitos', 'liberdade', 'constituição', 'político', 'legislation',
        'public policy', 'governance', 'international relations', 'diplomacy', 'political party'
    ],
    'negócios': [
        'business', 'company', 'entrepreneur', 'startup', 'market', 'industry', 'trade', 'commerce', 'investment',
        'revenue', 'profit', 'strategy', 'management', 'leadership', 'partnership', 'merger', 'acquisition',
        'sales', 'marketing', 'negócio', 'empresa', 'empreendedor', 'mercado', 'indústria', 'comércio',
        'investimento', 'receita', 'lucro', 'estratégia', 'gestão', 'liderança', 'parceria', 'fusão',
        'aquisição', 'vendas', 'marketing', 'venture capital', 'business plan', 'corporate culture',
        'innovation', 'brand', 'market research', 'business ethics', 'corporate social responsibility'
    ],
    'meio ambiente': [
        'environment', 'climate', 'pollution', 'conservation', 'wildlife', 'sustainability', 'recycling', 'energy',
        'global warming', 'green', 'nature', 'ecology', 'biodiversity', 'carbon', 'emissions', 'eco-friendly',
        'sustainable', 'meio ambiente', 'clima', 'poluição', 'conservação', 'fauna', 'sustentabilidade',
        'reciclagem', 'energia', 'aquecimento global', 'verde', 'natureza', 'ecologia', 'biodiversidade',
        'carbono', 'emissões', 'ecológico', 'sustentável', 'renewable energy', 'climate change',
        'environmental policy', 'natural resources', 'deforestation', 'conservation effort', 'sustainable development'
    ]
};
