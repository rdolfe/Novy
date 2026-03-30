const Groq = require('groq-sdk');

/**
 * NovyBot AI Service — Groq (Llama 3)
 * Ultra-fast inference with llama3-8b-8192
 */
class AIService {
  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    this.model = 'llama-3.3-70b-versatile'; // Current active Groq model (fast + smart)
    this.systemPrompt = `Tu es NovyBot, l'assistant IA officiel de Novy, le réseau social exclusif des étudiants de Paris Ynov Campus.
Tu as un ton amical, moderne et tu tutoies l'utilisateur.
Tu aides avec : les événements du campus, les stages/alternances, les projets étudiants, le code, les conseils carrière, et la vie étudiante.
Réponds toujours en français, de manière concise (max 3 paragraphes courts) et utilise des emojis avec modération.
Tu ne dois pas sortir de ton rôle d'assistant campus Ynov.`;
  }

  /**
   * Send a message and get a response
   * @param {Array<{role: 'user'|'assistant', text: string}>} history
   * @param {string} userMessage
   * @returns {Promise<string>}
   */
  async chat(history = [], userMessage) {
    const messages = [
      { role: 'system', content: this.systemPrompt },
      ...history.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.text,
      })),
      { role: 'user', content: userMessage },
    ];

    const completion = await this.groq.chat.completions.create({
      messages,
      model: this.model,
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content;
    if (!reply) throw new Error('Réponse vide de Groq');
    return reply;
  }

  /**
   * Moderate content — returns { safe: boolean, reason: string }
   */
  async moderate(text) {
    try {
      const prompt = `Analyse ce texte pour un réseau social étudiant. Est-il approprié ? Réponds UNIQUEMENT en JSON: {"safe": true/false, "reason": "raison courte"}\nTexte: "${text.slice(0, 200)}"`;
      const result = await this.chat([], prompt);
      const match = result.match(/\{[^}]+\}/);
      return match ? JSON.parse(match[0]) : { safe: true, reason: 'ok' };
    } catch {
      return { safe: true, reason: 'ok' };
    }
  }

  /**
   * Generate a short AI profile summary
   */
  async profileSummary({ name, role, skills = [], bio }) {
    const prompt = `Génère un résumé de profil professionnel en 2 phrases pour cet étudiant Ynov :
Nom: ${name}, Filière: ${role}, Compétences: ${skills.join(', ')}, Bio: ${bio || 'non renseignée'}.
Le résumé doit être en français, inspirant et donner envie de collaborer.`;
    return this.chat([], prompt);
  }
}

module.exports = new AIService();
