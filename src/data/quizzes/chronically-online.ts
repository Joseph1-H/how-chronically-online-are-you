import type { Quiz } from '../../types/quiz';

/**
 * Trait keys used throughout this quiz's answer options.
 *  me = Meme Knowledge
 *  sl = Slang Fluency
 *  ds = Doomscrolling
 *  tg = Touching Grass (grounded answers score high here)
 */

export const chronicallyOnline: Quiz = {
  slug: 'chronically-online',
  name: 'Chronically Online',
  title: 'HOW CHRONICALLY ONLINE ARE YOU?',
  subtitle: "There's normal online… and then there's you.",
  tagline:
    'Take the 2-minute internet culture quiz and find out how chronically online you really are.',
  emoji: '📱',
  blurb: '20 questions. 2 minutes. Zero judgment.',
  published: true,

  traits: [
    { id: 'me', label: 'Meme Knowledge' },
    { id: 'sl', label: 'Slang Fluency' },
    { id: 'ds', label: 'Doomscrolling' },
    { id: 'tg', label: 'Touching Grass' },
  ],

  questions: [
    {
      id: 'q1',
      topic: 'slang',
      prompt: 'You see someone say "bro is cooked." Your reaction?',
      options: [
        { id: 'a', label: 'What does "cooked" mean?', points: 0, traits: { sl: 0, tg: 3 } },
        { id: 'b', label: 'I understand the phrase.', points: 1, traits: { sl: 1, tg: 2 } },
        { id: 'c', label: 'I use it ironically.', points: 2, traits: { sl: 2, tg: 1 } },
        { id: 'd', label: 'I have personally said this today.', points: 3, traits: { sl: 3, tg: 0 } },
      ],
    },
    {
      id: 'q2',
      topic: 'memes',
      prompt: 'Someone sends you a meme from 3 months ago.',
      options: [
        { id: 'a', label: 'Haha, funny.', points: 0, traits: { me: 0, tg: 3 } },
        { id: 'b', label: "I've seen this.", points: 1, traits: { me: 1, tg: 2 } },
        { id: 'c', label: 'That meme is ancient.', points: 2, traits: { me: 2, tg: 1 } },
        {
          id: 'd',
          label: 'I saw the original post when it happened.',
          points: 3,
          traits: { me: 3, tg: 0 },
        },
      ],
    },
    {
      id: 'q3',
      topic: 'doomscrolling',
      prompt: 'How often do you check your phone without having a reason?',
      options: [
        { id: 'a', label: 'Almost never.', points: 0, traits: { ds: 0, tg: 3 } },
        { id: 'b', label: 'A few times a day.', points: 1, traits: { ds: 1, tg: 2 } },
        { id: 'c', label: 'Constantly.', points: 2, traits: { ds: 2, tg: 1 } },
        {
          id: 'd',
          label: 'I checked it while reading this question.',
          points: 3,
          traits: { ds: 3, tg: 0 },
        },
      ],
    },
    {
      id: 'q4',
      topic: 'reddit',
      prompt: 'Your relationship with Reddit is best described as…',
      options: [
        { id: 'a', label: "What's a subreddit?", points: 0, traits: { me: 0, tg: 3 } },
        { id: 'b', label: 'I lurk sometimes.', points: 1, traits: { me: 1, tg: 2 } },
        {
          id: 'c',
          label: "I have a comment history I'd never show anyone.",
          points: 2,
          traits: { me: 2, tg: 1 },
        },
        { id: 'd', label: 'I moderate a niche community.', points: 3, traits: { me: 3, tg: 0 } },
      ],
    },
    {
      id: 'q5',
      topic: 'tiktok',
      prompt: 'Your For You Page knows…',
      options: [
        { id: 'a', label: "I don't have TikTok.", points: 0, traits: { tg: 3 } },
        { id: 'b', label: 'My basic interests.', points: 1, traits: { me: 1, ds: 1, tg: 2 } },
        {
          id: 'c',
          label: "Things I've never said out loud.",
          points: 2,
          traits: { me: 2, ds: 2, tg: 1 },
        },
        {
          id: 'd',
          label: 'My diagnosis before my doctor does.',
          points: 3,
          traits: { me: 3, ds: 3, tg: 0 },
        },
      ],
    },
    {
      id: 'q6',
      topic: 'discord',
      prompt: 'How many Discord servers are you in?',
      options: [
        { id: 'a', label: 'Dis-what?', points: 0, traits: { tg: 3 } },
        { id: 'b', label: 'One or two.', points: 1, traits: { tg: 2 } },
        { id: 'c', label: 'More than I can count.', points: 2, traits: { ds: 1, tg: 1 } },
        {
          id: 'd',
          label: 'I have a different personality in each one.',
          points: 3,
          traits: { ds: 2, tg: 0 },
        },
      ],
    },
    {
      id: 'q7',
      topic: 'youtube',
      prompt: "It's 2 AM. YouTube autoplay has carried you to…",
      options: [
        { id: 'a', label: 'I was asleep hours ago.', points: 0, traits: { ds: 0, tg: 3 } },
        { id: 'b', label: 'A video I actually meant to watch.', points: 1, traits: { ds: 1, tg: 2 } },
        {
          id: 'c',
          label: 'A 45-minute video essay on something niche.',
          points: 2,
          traits: { ds: 2, tg: 1 },
        },
        {
          id: 'd',
          label: "A guy restoring a rusty wrench — and I'm invested.",
          points: 3,
          traits: { ds: 3, tg: 0 },
        },
      ],
    },
    {
      id: 'q8',
      topic: 'gaming',
      prompt: 'Someone types "GG." To you that means…',
      options: [
        { id: 'a', label: 'No idea.', points: 0, traits: { sl: 0, tg: 3 } },
        { id: 'b', label: 'Good game, I think?', points: 1, traits: { sl: 1, tg: 2 } },
        { id: 'c', label: 'I say it in real life now.', points: 2, traits: { sl: 2, tg: 1 } },
        { id: 'd', label: 'GG EZ. Reported.', points: 3, traits: { sl: 3, tg: 0 } },
      ],
    },
    {
      id: 'q9',
      topic: 'reaction-images',
      prompt: 'Someone asks for a very specific reaction image. You…',
      options: [
        { id: 'a', label: 'Send a thumbs up.', points: 0, traits: { me: 0, tg: 3 } },
        { id: 'b', label: 'Find one eventually.', points: 1, traits: { me: 1, tg: 2 } },
        { id: 'c', label: 'Have a labeled folder for exactly this.', points: 2, traits: { me: 2, tg: 1 } },
        {
          id: 'd',
          label: 'Produce the exact frame in under 4 seconds.',
          points: 3,
          traits: { me: 3, tg: 0 },
        },
      ],
    },
    {
      id: 'q10',
      topic: 'parasocial',
      prompt: 'A creator you follow takes a week off. You feel…',
      options: [
        { id: 'a', label: "I wouldn't even notice.", points: 0, traits: { tg: 3 } },
        { id: 'b', label: 'Mildly curious.', points: 1, traits: { tg: 2 } },
        { id: 'c', label: 'Genuinely concerned for them.', points: 2, traits: { ds: 1, tg: 1 } },
        { id: 'd', label: 'Personally abandoned.', points: 3, traits: { ds: 2, tg: 0 } },
      ],
    },
    {
      id: 'q11',
      topic: 'obscure-references',
      prompt: 'Your sense of humor mostly relies on…',
      options: [
        { id: 'a', label: 'Normal, out-loud jokes.', points: 0, traits: { me: 0, tg: 3 } },
        { id: 'b', label: 'The occasional meme.', points: 1, traits: { me: 1, tg: 2 } },
        {
          id: 'c',
          label: 'References nobody around me gets.',
          points: 2,
          traits: { me: 2, sl: 1, tg: 1 },
        },
        {
          id: 'd',
          label: 'Layers of irony that require a footnote.',
          points: 3,
          traits: { me: 3, sl: 2, tg: 0 },
        },
      ],
    },
    {
      id: 'q12',
      topic: 'online-arguments',
      prompt: 'A stranger is wrong on the internet. You…',
      options: [
        { id: 'a', label: 'Scroll past. Who cares.', points: 0, traits: { tg: 3 } },
        { id: 'b', label: "Draft a reply, don't send it.", points: 1, traits: { ds: 1, tg: 2 } },
        {
          id: 'c',
          label: 'Reply, then refresh for the response.',
          points: 2,
          traits: { ds: 2, tg: 1 },
        },
        {
          id: 'd',
          label: 'Already have screenshots and receipts ready.',
          points: 3,
          traits: { ds: 3, tg: 0 },
        },
      ],
    },
    {
      id: 'q13',
      topic: 'notifications',
      prompt: 'Your lock screen right now…',
      options: [
        { id: 'a', label: 'Clean. Inbox-zero energy.', points: 0, traits: { ds: 0, tg: 3 } },
        { id: 'b', label: "A few I'll get to.", points: 1, traits: { ds: 1, tg: 2 } },
        { id: 'c', label: "Hundreds. I've made peace with it.", points: 2, traits: { ds: 2, tg: 1 } },
        {
          id: 'd',
          label: 'Notifications off — I just check constantly on my own.',
          points: 3,
          traits: { ds: 3, tg: 0 },
        },
      ],
    },
    {
      id: 'q14',
      topic: 'screen-time',
      prompt: 'Your weekly screen-time report…',
      options: [
        { id: 'a', label: "I'm genuinely proud of it.", points: 0, traits: { ds: 0, tg: 3 } },
        { id: 'b', label: 'Not great, not terrible.', points: 1, traits: { ds: 1, tg: 2 } },
        { id: 'c', label: "I don't look. For my own safety.", points: 2, traits: { ds: 2, tg: 1 } },
        {
          id: 'd',
          label: "A full-time job's worth of hours.",
          points: 3,
          traits: { ds: 3, tg: 0 },
        },
      ],
    },
    {
      id: 'q15',
      topic: 'viral-trends',
      prompt: 'When something goes viral, you usually…',
      options: [
        {
          id: 'a',
          label: 'Hear about it from a coworker weeks later.',
          points: 0,
          traits: { me: 0, tg: 3 },
        },
        { id: 'b', label: 'Catch it eventually.', points: 1, traits: { me: 1, tg: 2 } },
        { id: 'c', label: 'See it the day it breaks.', points: 2, traits: { me: 2, tg: 1 } },
        {
          id: 'd',
          label: 'Watched it happen live and have opinions on the discourse.',
          points: 3,
          traits: { me: 3, tg: 0 },
        },
      ],
    },
    {
      id: 'q16',
      topic: 'multiple-accounts',
      prompt: 'How many accounts do you run on a single app?',
      options: [
        { id: 'a', label: 'One, obviously.', points: 0, traits: { tg: 3 } },
        { id: 'b', label: 'A main and a backup.', points: 1, traits: { tg: 2 } },
        { id: 'c', label: 'Main, finsta, and a lurk account.', points: 2, traits: { tg: 1 } },
        {
          id: 'd',
          label: "Accounts my closest friends don't know about.",
          points: 3,
          traits: { ds: 1, tg: 0 },
        },
      ],
    },
    {
      id: 'q17',
      topic: 'irony',
      prompt: 'When you say something is "so good"…',
      options: [
        { id: 'a', label: "I mean it's good.", points: 0, traits: { sl: 0, tg: 3 } },
        { id: 'b', label: 'Usually genuine.', points: 1, traits: { sl: 1, tg: 2 } },
        { id: 'c', label: 'Could be either. Depends.', points: 2, traits: { sl: 2, tg: 1 } },
        {
          id: 'd',
          label: 'Sincerity died years ago. Everything is a bit.',
          points: 3,
          traits: { sl: 3, tg: 0 },
        },
      ],
    },
    {
      id: 'q18',
      topic: 'slang',
      prompt: "Pick the one you'd actually type:",
      options: [
        { id: 'a', label: '"That is funny."', points: 0, traits: { sl: 0, tg: 3 } },
        { id: 'b', label: '"lol"', points: 1, traits: { sl: 1, tg: 2 } },
        { id: 'c', label: '"lmaooo"', points: 2, traits: { sl: 2, tg: 1 } },
        {
          id: 'd',
          label: '"💀💀 no bc why is this so real"',
          points: 3,
          traits: { sl: 3, tg: 0 },
        },
      ],
    },
    {
      id: 'q19',
      topic: 'algorithm-awareness',
      prompt: 'You think about "the algorithm"…',
      options: [
        { id: 'a', label: 'Never. What algorithm?', points: 0, traits: { tg: 3 } },
        { id: 'b', label: 'Occasionally.', points: 1, traits: { tg: 2 } },
        { id: 'c', label: 'I curate my feed on purpose.', points: 2, traits: { me: 1, tg: 1 } },
        {
          id: 'd',
          label: 'I bargain with it. I know when it is mad at me.',
          points: 3,
          traits: { me: 2, ds: 1, tg: 0 },
        },
      ],
    },
    {
      id: 'q20',
      topic: 'meta',
      prompt: 'Be honest — how did you get to this quiz?',
      options: [
        {
          id: 'a',
          label: 'Someone sent it to me; I rarely do these.',
          points: 0,
          traits: { tg: 3 },
        },
        { id: 'b', label: 'Saw it shared and got curious.', points: 1, traits: { tg: 2 } },
        {
          id: 'c',
          label: 'It was already circulating in my group chat.',
          points: 2,
          traits: { me: 1, tg: 1 },
        },
        { id: 'd', label: "I find everything before it's cool.", points: 3, traits: { me: 2, tg: 0 } },
      ],
    },
  ],

  tiers: [
    {
      min: 0,
      max: 20,
      title: 'THE NORMIE',
      emoji: '🌱',
      description: 'You use the internet. The internet does not use you.',
      gradient: 'from-emerald-400 via-teal-400 to-green-500',
      accent: '#34d399',
    },
    {
      min: 21,
      max: 40,
      title: 'CASUAL SCROLLER',
      emoji: '☕',
      description:
        'You know what\'s happening online, but you still have a life outside your phone.',
      gradient: 'from-sky-400 via-cyan-400 to-blue-500',
      accent: '#38bdf8',
    },
    {
      min: 41,
      max: 60,
      title: 'INTERNET NATIVE',
      emoji: '🌐',
      description:
        'You speak fluent internet and probably know more slang than you would like to admit.',
      gradient: 'from-violet-400 via-purple-400 to-indigo-500',
      accent: '#a78bfa',
    },
    {
      min: 61,
      max: 80,
      title: 'TERMINALLY ONLINE',
      emoji: '🕳️',
      description: 'You have seen things that cannot be unseen.',
      gradient: 'from-fuchsia-400 via-pink-500 to-rose-500',
      accent: '#e879f9',
    },
    {
      min: 81,
      max: 95,
      title: 'CHRONICALLY ONLINE',
      emoji: '💀',
      description: 'The algorithm knows you better than some of your friends.',
      gradient: 'from-orange-400 via-red-500 to-pink-600',
      accent: '#fb7185',
    },
    {
      min: 96,
      max: 100,
      title: 'THE INTERNET',
      emoji: '👁️',
      description: 'You are no longer using the internet. You ARE the internet.',
      gradient: 'from-yellow-300 via-fuchsia-500 to-cyan-400',
      accent: '#f0abfc',
    },
  ],
};
