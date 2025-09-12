# 🚀 Deployment Guide

This guide will help you deploy the Weather App to production using Vercel for the frontend and Next.js API routes for the backend.

## 📋 Prerequisites

1. **OpenWeatherMap API Key**
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Generate a free API key
   - Note: Free tier allows 1000 calls/day

2. **GitHub Account**
   - For version control and deployment

3. **Vercel Account**
   - Sign up at [Vercel](https://vercel.com)

## 🔧 Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit: Weather App full-stack implementation"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/weather-app.git
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (auto-detected)

#### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: weather-app
# - Directory: ./
```

### 3. Configure Environment Variables

In your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

```
OPENWEATHER_API_KEY = your_openweathermap_api_key_here
NODE_ENV = production
```

### 4. Redeploy with Environment Variables

After adding environment variables, trigger a new deployment:

```bash
# Via CLI
vercel --prod

# Or via dashboard - click "Redeploy" button
```

## 🌐 Access Your Deployed App

Once deployed, you'll get a URL like:
- **Production URL**: `https://weather-app-xyz.vercel.app`
- **Preview URLs**: Available for each git push

## 🔍 Testing Your Deployment

### 1. Test Core Functionality
- [ ] Home page loads correctly
- [ ] Geolocation permission works
- [ ] City search functionality
- [ ] Weather details page
- [ ] Search history persistence
- [ ] About page displays correctly

### 2. Test API Endpoints
```bash
# Test weather API
curl "https://your-app.vercel.app/api/weather?city=London"

# Test search history
curl "https://your-app.vercel.app/api/searches"
```

### 3. Test Error Handling
- [ ] Invalid city names
- [ ] Network connectivity issues
- [ ] Geolocation denied

## 🛠 Development vs Production

### Development Mode
- Uses Express.js server on port 5000
- Backend API at `http://localhost:5000`
- Frontend at `http://localhost:3000`

### Production Mode
- Uses Next.js API routes
- All API calls go to `/api/*` endpoints
- Single deployment on Vercel

## 📊 Monitoring and Analytics

### Vercel Analytics
1. Enable Vercel Analytics in your dashboard
2. Monitor performance metrics
3. Track user interactions

### Error Monitoring
- Check Vercel function logs
- Monitor API response times
- Track error rates

## 🔄 Continuous Deployment

### Automatic Deployments
- Every push to `main` branch triggers production deployment
- Pull requests get preview deployments
- Branch deployments for feature testing

### Manual Deployments
```bash
# Deploy specific branch
vercel --prod

# Deploy with specific environment
vercel --env production
```

## 🚨 Troubleshooting

### Common Issues

#### 1. API Key Not Working
```bash
# Check environment variables
vercel env ls

# Add/update API key
vercel env add OPENWEATHER_API_KEY
```

#### 2. Build Failures
```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm install
npm run build
```

#### 3. CORS Issues
- Next.js API routes handle CORS automatically
- No additional configuration needed

#### 4. Environment Variables Not Loading
```bash
# Redeploy after adding env vars
vercel --prod
```

### Debug Commands
```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Check environment variables
vercel env ls
```

## 📈 Performance Optimization

### Vercel Optimizations
- Automatic image optimization
- Edge functions for global performance
- CDN distribution
- Automatic HTTPS

### Code Optimizations
- Next.js automatic code splitting
- API route optimization
- Efficient data fetching
- Minimal bundle size

## 🔒 Security Considerations

### API Security
- API key stored as environment variable
- No sensitive data in client-side code
- Rate limiting via OpenWeatherMap

### Deployment Security
- HTTPS enforced by Vercel
- Environment variables encrypted
- No database credentials exposed

## 📝 Post-Deployment Checklist

- [ ] Update README.md with live demo URL
- [ ] Test all functionality on production
- [ ] Verify environment variables are set
- [ ] Check error handling works
- [ ] Test on mobile devices
- [ ] Verify search history persistence
- [ ] Check API rate limits
- [ ] Monitor performance metrics

## 🎯 Next Steps

### Optional Enhancements
1. **Custom Domain**: Add your own domain in Vercel
2. **Database Integration**: Add persistent storage
3. **Authentication**: User accounts and preferences
4. **Advanced Features**: Weather forecasts, maps, alerts
5. **Monitoring**: Set up error tracking and analytics

### Maintenance
- Monitor API usage and costs
- Update dependencies regularly
- Review and optimize performance
- Keep documentation updated

---

## 🎉 Congratulations!

Your Weather App is now live and ready to use! Share your deployed URL and showcase your full-stack development skills.

**Live Demo**: `https://your-app.vercel.app`
**GitHub Repository**: `https://github.com/yourusername/weather-app`
