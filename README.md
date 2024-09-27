# Name-Wallet Frontend

**This is a short description of how someone would operate this Name-Wallet frontend.**

1. Copy this github repository to your own github account. https://github.com/DashMoney/Name-Wallet-Frontend
2. Connect copied Github repository to hosting service (Vercel - I use Hobby-free edition) (Or pull repo and run locally)
3. Add environment variables (See Below)

These are the environmental variable that you need to create for operation:

- VITE_FRONTEND_NAME = WebsiteName
- VITE_BKGD = primary
- VITE_NETWORK = testnet

Frontend Name is what will appear in the top of page navigation bar.

BKGD is 'Background' which can be dark or primary

NETWORK can be testnet or mainnet

### React + Vite (Everything else is from initial Vite setup)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
