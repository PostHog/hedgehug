export type Locale = "pt-BR" | "en-US"

export const translations = {
  // Header
  "nav.home": { "pt-BR": "Início", "en-US": "Home" },
  "nav.adopt": { "pt-BR": "Adotar", "en-US": "Adopt" },

  // Hero
  "hero.badge": {
    "pt-BR": "São Paulo, SP · Desde 2019",
    "en-US": "São Paulo, SP · Since 2019",
  },
  "hero.title.line1": {
    "pt-BR": "Adote um ouriço,",
    "en-US": "Adopt a hedgehog,",
  },
  "hero.title.line2": {
    "pt-BR": "ganhe um amigo",
    "en-US": "gain a friend",
  },
  "hero.description": {
    "pt-BR":
      "O HedgeHug é um centro de resgate e adoção de ouriços. Todos os nossos ouriços são vacinados, socializados e prontos para encontrar um lar cheio de amor.",
    "en-US":
      "HedgeHug is a hedgehog rescue and adoption center. All our hedgehogs are vaccinated, socialized, and ready to find a loving home.",
  },
  "hero.cta": { "pt-BR": "Conheça os Ouriços", "en-US": "Meet the Hedgehogs" },

  // About
  "about.title": {
    "pt-BR": "Por Que Adotar no HedgeHug",
    "en-US": "Why Adopt at HedgeHug",
  },
  "about.subtitle": {
    "pt-BR": "Mais de 200 ouriços encontraram um lar desde 2019.",
    "en-US": "Over 200 hedgehogs have found homes since 2019.",
  },
  "about.rescue.title": { "pt-BR": "Resgate com Amor", "en-US": "Rescue with Love" },
  "about.rescue.description": {
    "pt-BR":
      "Resgatamos ouriços de situações de abandono e maus-tratos e os reabilitamos com carinho e cuidado profissional.",
    "en-US":
      "We rescue hedgehogs from abandonment and mistreatment and rehabilitate them with care and professional attention.",
  },
  "about.health.title": { "pt-BR": "Saúde em Dia", "en-US": "Health First" },
  "about.health.description": {
    "pt-BR":
      "Todos os ouriços são vacinados, microchipados e passam por avaliação veterinária completa antes da adoção.",
    "en-US":
      "All hedgehogs are vaccinated, microchipped, and undergo a full veterinary evaluation before adoption.",
  },
  "about.adoption.title": {
    "pt-BR": "Adoção Responsável",
    "en-US": "Responsible Adoption",
  },
  "about.adoption.description": {
    "pt-BR":
      "Acompanhamos cada adoção de perto, com entrevista prévia e suporte pós-adoção por 30 dias.",
    "en-US":
      "We closely follow each adoption with a prior interview and 30-day post-adoption support.",
  },

  // Featured
  "featured.title": { "pt-BR": "Prontos para Adoção", "en-US": "Ready for Adoption" },
  "featured.subtitle": {
    "pt-BR": "Estes ouriços estão esperando por você",
    "en-US": "These hedgehogs are waiting for you",
  },

  // Catalog
  "catalog.title": { "pt-BR": "Ouriços para Adoção", "en-US": "Hedgehogs for Adoption" },
  "catalog.count": {
    "pt-BR": (n: number) => `${n} ouriços esperando por um lar`,
    "en-US": (n: number) => `${n} hedgehog${n !== 1 ? "s" : ""} waiting for a home`,
  },
  "catalog.empty": {
    "pt-BR": "Nenhum ouriço encontrado. Tente ajustar os filtros.",
    "en-US": "No hedgehogs found. Try adjusting the filters.",
  },

  // Filters
  "filter.search": {
    "pt-BR": "Buscar por nome ou raça...",
    "en-US": "Search by name or breed...",
  },
  "filter.sort.recent": { "pt-BR": "Mais Recentes", "en-US": "Most Recent" },
  "filter.sort.youngest": { "pt-BR": "Mais Novos", "en-US": "Youngest" },
  "filter.sort.oldest": { "pt-BR": "Mais Velhos", "en-US": "Oldest" },
  "filter.sort.name": { "pt-BR": "Nome A-Z", "en-US": "Name A-Z" },
  "filter.clear": { "pt-BR": "Limpar", "en-US": "Clear" },

  // Temperaments
  "temperament.Calm": { "pt-BR": "Calmo", "en-US": "Calm" },
  "temperament.Friendly": { "pt-BR": "Amigável", "en-US": "Friendly" },
  "temperament.Playful": { "pt-BR": "Brincalhão", "en-US": "Playful" },
  "temperament.Adventurous": { "pt-BR": "Aventureiro", "en-US": "Adventurous" },
  "temperament.Shy": { "pt-BR": "Tímido", "en-US": "Shy" },

  // Card
  "card.adopted": { "pt-BR": "Já adotado", "en-US": "Already adopted" },
  "card.available": { "pt-BR": "Disponível para adoção", "en-US": "Available for adoption" },
  "card.adopted.overlay": { "pt-BR": "ADOTADO", "en-US": "ADOPTED" },
  "card.interested": {
    "pt-BR": (n: number) => `${n} interessados`,
    "en-US": (n: number) => `${n} interested`,
  },
  "card.views": {
    "pt-BR": (n: number) => `${n} visualizações`,
    "en-US": (n: number) => `${n} views`,
  },

  // Detail page
  "detail.back": { "pt-BR": "Voltar aos Ouriços", "en-US": "Back to Hedgehogs" },
  "detail.available": { "pt-BR": "Disponível para adoção", "en-US": "Available for adoption" },
  "detail.found_home": { "pt-BR": "Já encontrou um lar", "en-US": "Already found a home" },
  "detail.age": { "pt-BR": "Idade", "en-US": "Age" },
  "detail.breed": { "pt-BR": "Raça", "en-US": "Breed" },
  "detail.weight": { "pt-BR": "Peso", "en-US": "Weight" },
  "detail.color": { "pt-BR": "Cor", "en-US": "Color" },
  "detail.fee": { "pt-BR": "Taxa de Adoção", "en-US": "Adoption Fee" },
  "detail.health": { "pt-BR": "Saúde", "en-US": "Health" },
  "detail.about": {
    "pt-BR": (name: string) => `Sobre ${name}`,
    "en-US": (name: string) => `About ${name}`,
  },
  "detail.sex.M": { "pt-BR": "♂ Macho", "en-US": "♂ Male" },
  "detail.sex.F": { "pt-BR": "♀ Fêmea", "en-US": "♀ Female" },

  // Age formatting
  "age.newborn": { "pt-BR": "Recém-nascido", "en-US": "Newborn" },
  "age.month": { "pt-BR": "mês", "en-US": "month" },
  "age.months": { "pt-BR": "meses", "en-US": "months" },
  "age.year": { "pt-BR": "ano", "en-US": "year" },
  "age.years": { "pt-BR": "anos", "en-US": "years" },
  "age.and": { "pt-BR": "e", "en-US": "and" },

  // Adopt button
  "adopt.cta": { "pt-BR": "Quero Adotar", "en-US": "I Want to Adopt" },
  "adopt.terms.title": { "pt-BR": "Termos de Adoção", "en-US": "Adoption Terms" },
  "adopt.terms.description": {
    "pt-BR": (name: string) =>
      `Leia e aceite os termos antes de prosseguir com a adoção de ${name}.`,
    "en-US": (name: string) =>
      `Read and accept the terms before proceeding with ${name}'s adoption.`,
  },
  "adopt.terms.intro": {
    "pt-BR": "Ao adotar um ouriço do HedgeHug, eu me comprometo a:",
    "en-US": "By adopting a hedgehog from HedgeHug, I commit to:",
  },
  "adopt.terms.items": {
    "pt-BR": [
      "Oferecer um ambiente adequado com gaiola espaçosa (mínimo 60x90cm) e temperatura controlada entre 24-28°C",
      "Fornecer alimentação adequada (ração para ouriços e petiscos de insetos)",
      "Levar o ouriço a consultas veterinárias semestrais com especialista em exóticos",
      "Não abandonar, vender ou repassar o ouriço sem comunicar o HedgeHug",
      "Permitir uma visita de acompanhamento em até 30 dias após a adoção",
    ],
    "en-US": [
      "Provide an adequate environment with a spacious cage (minimum 60x90cm) and controlled temperature between 24-28°C",
      "Provide adequate food (hedgehog-specific feed and insect treats)",
      "Take the hedgehog to biannual veterinary check-ups with an exotic animal specialist",
      "Not abandon, sell, or transfer the hedgehog without informing HedgeHug",
      "Allow a follow-up visit within 30 days of adoption",
    ],
  },
  "adopt.terms.checkbox": {
    "pt-BR": "Li e aceito os termos de adoção responsável do HedgeHug",
    "en-US": "I have read and accept HedgeHug's responsible adoption terms",
  },
  "adopt.terms.cancel": { "pt-BR": "Cancelar", "en-US": "Cancel" },
  "adopt.terms.accept": { "pt-BR": "Aceitar e Continuar", "en-US": "Accept and Continue" },
  "adopt.confirm.title": { "pt-BR": "Confirmar Adoção", "en-US": "Confirm Adoption" },
  "adopt.confirm.description": {
    "pt-BR": (name: string) =>
      `Você está prestes a solicitar a adoção de ${name}.`,
    "en-US": (name: string) =>
      `You are about to request the adoption of ${name}.`,
  },
  "adopt.confirm.terms_ok": {
    "pt-BR": "Termos de adoção aceitos",
    "en-US": "Adoption terms accepted",
  },
  "adopt.confirm.terms_implicit": {
    "pt-BR": "Ao confirmar, você aceita os termos de adoção",
    "en-US": "By confirming, you accept the adoption terms",
  },
  "adopt.confirm.interview": {
    "pt-BR": "Nossa equipe entrará em contato para agendar uma entrevista",
    "en-US": "Our team will contact you to schedule an interview",
  },
  "adopt.confirm.reserved": {
    "pt-BR": (name: string) => `${name} ficará reservado(a) por 48 horas`,
    "en-US": (name: string) => `${name} will be reserved for 48 hours`,
  },
  "adopt.confirm.back": { "pt-BR": "Voltar", "en-US": "Back" },
  "adopt.confirm.button": { "pt-BR": "Confirmar Adoção", "en-US": "Confirm Adoption" },
  "adopt.success.title": { "pt-BR": "Adoção Solicitada!", "en-US": "Adoption Requested!" },
  "adopt.success.description": {
    "pt-BR": (name: string) =>
      `Sua solicitação de adoção de ${name} foi enviada com sucesso. Nossa equipe entrará em contato em até 24 horas para agendar a entrevista.`,
    "en-US": (name: string) =>
      `Your adoption request for ${name} has been sent successfully. Our team will contact you within 24 hours to schedule the interview.`,
  },
  "adopt.success.close": { "pt-BR": "Fechar", "en-US": "Close" },

  // Chat trigger
  "chat.ask_about": {
    "pt-BR": (name: string) => `Perguntar Sobre ${name}`,
    "en-US": (name: string) => `Ask About ${name}`,
  },
  "chat.open_message": {
    "pt-BR": (name: string) => `Gostaria de saber mais sobre o(a) ${name}`,
    "en-US": (name: string) => `I'd like to know more about ${name}`,
  },

  // Chat panel
  "chat.title": { "pt-BR": "Fale com o Max", "en-US": "Chat with Max" },
  "chat.subtitle": { "pt-BR": "Assistente HedgeHug", "en-US": "HedgeHug Assistant" },
  "chat.placeholder": { "pt-BR": "Digite uma mensagem...", "en-US": "Type a message..." },
  "chat.welcome": {
    "pt-BR":
      "Oi! Eu sou o Max, seu guia no HedgeHug! Se você quer conhecer nossos ouriços, saber sobre o processo de adoção ou tirar dúvidas sobre cuidados — estou aqui para ajudar. Como posso te ajudar hoje?",
    "en-US":
      "Hi! I'm Max, your guide at HedgeHug! Whether you want to meet our hedgehogs, learn about the adoption process, or have questions about care — I'm here to help. How can I help you today?",
  },

  // Name gate
  "gate.title": { "pt-BR": "Bem-vindo ao HedgeHug", "en-US": "Welcome to HedgeHug" },
  "gate.subtitle": {
    "pt-BR": "Adote um ouriço, ganhe um amigo 🦔",
    "en-US": "Adopt a hedgehog, gain a friend 🦔",
  },
  "gate.label": {
    "pt-BR": "Como devemos chamá-lo?",
    "en-US": "What should we call you?",
  },
  "gate.placeholder": { "pt-BR": "Seu nome", "en-US": "Your name" },
  "gate.submit": { "pt-BR": "Entrar", "en-US": "Enter" },
  "gate.disclaimer": {
    "pt-BR": "Usamos apenas seu nome para personalizar a experiência.",
    "en-US": "We only use your name to personalize the experience.",
  },

  // Footer
  "footer.description": {
    "pt-BR":
      "Centro de resgate e adoção de ouriços desde 2019. Encontrando lares amorosos para ouriços que merecem uma segunda chance.",
    "en-US":
      "Hedgehog rescue and adoption center since 2019. Finding loving homes for hedgehogs that deserve a second chance.",
  },
  "footer.visit": { "pt-BR": "Visite-nos", "en-US": "Visit Us" },
  "footer.contact": { "pt-BR": "Contato", "en-US": "Contact" },
  "footer.rights": {
    "pt-BR": "Todos os direitos reservados.",
    "en-US": "All rights reserved.",
  },

  // Error boundary
  "error.title": { "pt-BR": "Algo deu errado", "en-US": "Something went wrong" },
  "error.description": {
    "pt-BR": "Um erro inesperado aconteceu. Tente recarregar a página.",
    "en-US": "An unexpected error occurred. Try reloading the page.",
  },
  "error.retry": { "pt-BR": "Tentar novamente", "en-US": "Try again" },
} as const

export type TranslationKey = keyof typeof translations
