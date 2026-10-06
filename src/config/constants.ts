/**
 * App-wide configuration. Edit these in one place.
 */

/** Public-facing product name shown across the UI and on the share card. */
export const SITE_NAME = 'QuizLab';

/**
 * Canonical site URL used in share text and links. No trailing slash.
 * Update this to your real domain after deploying.
 */
export const SITE_URL = 'https://onlinetest.vercel.app';

/**
 * Optional hosted donation link (Ko-fi, Buy Me a Coffee, Stripe, GitHub
 * Sponsors…). Leave '' if you only accept crypto. When set, it renders as a
 * button alongside the crypto options.
 */
export const SUPPORT_URL = '';

/** A crypto wallet people can send a tip to. */
export interface CryptoWallet {
  /** Ticker, e.g. 'ETH', 'BTC', 'SOL', 'USDC'. */
  coin: string;
  /** Network / display name, e.g. 'Ethereum (ERC-20)'. */
  label: string;
  /** The receiving address. */
  address: string;
}

/**
 * Crypto donation wallets. Add one entry per coin and the Support section
 * renders each with a copy-to-clipboard button. Leave the array empty to show
 * a "coming soon" note instead.
 *
 * Example:
 *   { coin: 'ETH', label: 'Ethereum (ERC-20)', address: '0xYOUR_ADDRESS' },
 *   { coin: 'BTC', label: 'Bitcoin', address: 'bc1YOUR_ADDRESS' },
 */
export const CRYPTO_WALLETS: CryptoWallet[] = [
  { coin: 'SOL', label: 'Solana', address: 'zAVwcqpag3mkDRfivC7iBJhEKE7jzP6A3qLxYyNDsYg' },
  { coin: 'ETH', label: 'Ethereum (ERC-20)', address: '0x34cec447E34ede433B4547f2F4E22a3D78d20407' },
  { coin: 'BTC', label: 'Bitcoin', address: 'bc1qsay9qwgyhjdnzpzg4lp3yeth0ucgc0f58wutap' },
];
