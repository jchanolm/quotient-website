document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('.smooth-scroll').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Main animation canvas
    const canvas = document.getElementById('animationCanvas');
    const ctx = canvas.getContext('2d');
    
    // Query elements
    const queryText = document.getElementById('query-text');
    const queryStatusText = document.getElementById('query-status-text');
    // Use the pulse indicator that's already in the HTML
    const queryStatusIndicator = document.querySelector('#query-status-text').previousElementSibling;
    
    // Address animation canvas
    const addressAnimationCanvas = document.getElementById('addressAnimationCanvas');
    const addressCtx = addressAnimationCanvas ? addressAnimationCanvas.getContext('2d') : null;
  
    // Set canvas dimensions
    let width, height, addressWidth, addressHeight;
    function resizeCanvas() {
      // Main canvas
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      // Address animation canvas
      if (addressAnimationCanvas) {
        const container = addressAnimationCanvas.parentElement;
        addressWidth = container.clientWidth;
        addressHeight = container.clientHeight;
        addressAnimationCanvas.width = addressWidth;
        addressAnimationCanvas.height = addressHeight;
      }
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  
    // Colors
    const baseBlue = '#0057ff';
    const scannerBlue = '#00a0ff';
    const randoColor = '#666666';
    const builderColor = '#ffffff';
    
    // Initialize main constellation
    const wallets = [];
    const connections = [];
    const maxWallets = 80; // Reduced maximum number of wallets
    
    // Initialize how it works visualization
    const howWallets = [];
    const platforms = [];
    const insights = [];
    
    // Sample queries to cycle through
    const queries = [
      "Who is building dev tools for prediction markets on Base?",
      "What are the most interesting Arbitrum gaming hackathon projects?",
      "Which protocols will be impacted if this DAO proposal passes?",
      "Which Farcaster channels do my most engaged users belong to?"
    ];
    
    // Platform types for how it works
    const platformTypes = [
      { name: "GitHub", color: "#6cc644" },
      { name: "Farcaster", color: "#8a63d2" },
      { name: "Mirror", color: "#ffffff" }
    ];
    
    // Builder names - more technical
    const builderPrefixes = ['frame', 'base', 'devx', 'cast', 'forecast', 'predict', 'onchain', 'meta', 'deploy', 'smart', 'core', 'zephyr'];
    const builderSuffixes = ['dev', 'builder', 'hacker', 'ship', 'craft', 'stack', 'engineer', 'coder', 'daemon', 'oracle', 'node'];
    
    // Random addresses - more speculative
    const randoPrefixes = ['ape', 'degen', 'moon', 'pepe', 'wojak', 'chad', 'fomo', 'pump', 'shib', 'hodl', 'bull', 'trader'];
    const randoSuffixes = ['ape', 'moon', 'bro', 'king', 'chad', 'fren', 'ser', 'rich', 'whale', 'yolo', 'diamond', 'defi'];
    
    // Generate a builder ENS name
    function generateBuilderENS() {
      const randomPrefix = builderPrefixes[Math.floor(Math.random() * builderPrefixes.length)];
      if (Math.random() < 0.3) {
        return randomPrefix + '.eth';
      } else {
        const randomSuffix = builderSuffixes[Math.floor(Math.random() * builderSuffixes.length)];
        return randomPrefix + randomSuffix + '.eth';
      }
    }
    
    // Generate a random wallet (not builder)
    function generateRandomENS() {
      const randomPrefix = randoPrefixes[Math.floor(Math.random() * randoPrefixes.length)];
      if (Math.random() < 0.3) {
        return randomPrefix + '.eth';
      } else {
        const randomSuffix = randoSuffixes[Math.floor(Math.random() * randoSuffixes.length)];
        return randomPrefix + randomSuffix + '.eth';
      }
    }
    
    // Generate hex address
    function generateHexAddress() {
      const chars = '0123456789abcdef';
      let hex = '0x';
      const length = 6 + Math.floor(Math.random() * 4);
      
      for (let i = 0; i < length; i++) {
        hex += chars[Math.floor(Math.random() * chars.length)];
      }
      
      return hex;
    }
    
    // Main wallet class for constellation
    class Wallet {
      constructor() {
        this.isBuilder = Math.random() < 0.15; // 15% are builders
        
        if (this.isBuilder) {
          // For builders, use builder names
          this.address = Math.random() < 0.6 ? generateBuilderENS() : generateHexAddress();
          this.color = builderColor;
        } else {
          // For regular wallets, use random names
          this.address = Math.random() < 0.7 ? generateRandomENS() : generateHexAddress(); 
          this.color = randoColor;
        }
        
        // Position more randomly across the screen
        if (Math.random() < 0.7) {
          // Most wallets spread across the screen
          this.x = Math.random() * width;
          this.y = Math.random() * height;
        } else {
          // Some wallets in a loose constellation pattern
          const angle = Math.random() * Math.PI * 2;
          const radius = 50 + Math.random() * (Math.min(width, height) * 0.4);
          this.x = width / 2 + Math.cos(angle) * radius;
          this.y = height / 2 + Math.sin(angle) * radius;
        }
        
        // Movement (drastically slower)
        this.vx = (Math.random() - 0.5) * 0.05; // Drastically reduced
        this.vy = (Math.random() - 0.5) * 0.05; // Drastically reduced
        
        // Add some oscillation to movement (drastically slower)
        this.oscillateX = Math.random() < 0.5;
        this.oscillateY = Math.random() < 0.5;
        this.oscillationSpeed = 0.002 + Math.random() * 0.003; // Drastically reduced
        this.oscillationAmplitude = 0.2 + Math.random() * 0.6; // Reduced amplitude
        this.oscillationOffset = Math.random() * Math.PI * 2;
        this.time = 0;
        
        this.size = 12 + Math.floor(Math.random() * 4);
        this.opacity = 0.4 + Math.random() * 0.4;
        this.highlighted = false;
      }
      
      update() {
        // Increment time for oscillation (drastically slower)
        this.time += 0.001; // Drastically reduced
        
        // Gradually increase velocity from 0 to avoid initial aggressive movement
        if (Math.abs(this.vx) < 0.05) {
          this.vx += (Math.random() - 0.5) * 0.001;
        }
        if (Math.abs(this.vy) < 0.05) {
          this.vy += (Math.random() - 0.5) * 0.001;
        }
        
        // Apply base movement
        this.x += this.vx;
        this.y += this.vy;
        
        // Apply oscillation if enabled, with gradual increase
        if (this.oscillateX) {
          // Use a dampening factor that increases over time
          const dampening = Math.min(1, this.time / 10);
          this.x += Math.sin(this.time * this.oscillationSpeed + this.oscillationOffset) * this.oscillationAmplitude * dampening;
        }
        
        if (this.oscillateY) {
          // Use a dampening factor that increases over time
          const dampening = Math.min(1, this.time / 10);
          this.y += Math.cos(this.time * this.oscillationSpeed + this.oscillationOffset) * this.oscillationAmplitude * dampening;
        }
        
        // Boundary checking - reverse direction if hitting edge
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      
      draw() {
        ctx.globalAlpha = this.opacity;
        ctx.font = `${this.size}px monospace`;
        ctx.fillStyle = this.color;
        
        // Draw wallet address
        ctx.fillText(this.address, this.x, this.y);
        
        ctx.globalAlpha = 1.0;
      }
    }
    
    // Create connections between wallets
    function createConnections() {
      // Clear existing connections
      connections.length = 0;
      
      for (let i = 0; i < wallets.length; i++) {
        for (let j = i + 1; j < wallets.length; j++) {
          const wallet1 = wallets[i];
          const wallet2 = wallets[j];
          
          // Calculate distance
          const dx = wallet1.x - wallet2.x;
          const dy = wallet1.y - wallet2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Connect if close enough (and not too many connections already)
          if (distance < 120 && Math.random() < 0.05) {
            connections.push({
              wallet1: wallet1,
              wallet2: wallet2,
              opacity: 0.05 + Math.random() * 0.05
            });
          }
        }
      }
    }
    
    // Draw constellation connections
    function drawConnections() {
      connections.forEach(conn => {
        // Update positions based on wallet movement
        const x1 = conn.wallet1.x;
        const y1 = conn.wallet1.y;
        const x2 = conn.wallet2.x;
        const y2 = conn.wallet2.y;
        
        // Draw connection line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        
        // Subtle white connections
        ctx.strokeStyle = `rgba(255, 255, 255, ${conn.opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });
    }
    
    // Type writer effect for query - SLOW
    function typeWriter(text, i = 0) {
      if (i < text.length) {
        queryText.textContent += text.charAt(i);
        i++;
        setTimeout(() => typeWriter(text, i), 80); // slower typing speed
      } else {
        // Typing complete, update status
        setTimeout(() => {
          queryStatusText.textContent = "Query completed, found matching builders";
          
          // After a delay, clear for next query
          setTimeout(() => {
            // First fade out the current text
            fadeOutText();
          }, 3000);
        }, 1000);
      }
    }
    
    // Fade out the query text
    function fadeOutText() {
      // Create a fade out effect by reducing opacity
      let opacity = 1;
      const fadeInterval = setInterval(() => {
        opacity -= 0.1;
        if (opacity <= 0) {
          clearInterval(fadeInterval);
          // Once faded out, clear and start next query
          clearAndTypeNextQuery();
        } else {
          queryText.style.opacity = opacity;
        }
      }, 50);
    }
    
    // Clear query and type the next one
    let currentQueryIndex = 0;
    function clearAndTypeNextQuery() {
      // Clear current query
      queryText.textContent = "";
      // Reset opacity
      queryText.style.opacity = 1;
      
      // Reset status
      queryStatusText.textContent = "Ready to search...";
      
      // Get next query
      currentQueryIndex = (currentQueryIndex + 1) % queries.length;
      const nextQuery = queries[currentQueryIndex];
      
      // Start typing after a delay
      setTimeout(() => {
        typeWriter(nextQuery);
      }, 800);
    }
    
    // Animation loop for main animation
    function animate() {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw connections
      drawConnections();
      
      // Update and draw wallets
      wallets.forEach(wallet => {
        wallet.update();
        wallet.draw();
      });
      
      // Request next frame
      requestAnimationFrame(animate);
    }
    
    // ADDRESS ANIMATION VISUALIZATION
    
    // Generate wallet address fragment (either hex or ENS)
    function generateWalletFragment() {
      // 30% chance of generating an ENS name instead of hex address
      if (Math.random() < 0.3) {
        return generateENSName();
      } else {
        const chars = '0123456789abcdef';
        let fragment = '0x';
        const length = 4 + Math.floor(Math.random() * 8); // Random length between 4-12 chars
        for (let i = 0; i < length; i++) {
          fragment += chars[Math.floor(Math.random() * chars.length)];
        }
        return fragment;
      }
    }
    
    // Generate ENS name
    function generateENSName() {
      const prefixes = ['vitalik', 'crypto', 'eth', 'nft', 'defi', 'based', 'punk', 'ape', 'degen', 'moon', 'pepe', 
                     'trader', 'dao', 'meta', 'frens', 'anon', 'satoshi', 'hodl', 'web3', 'pixel'];
      const suffixes = ['guy', 'dev', 'bro', 'lord', 'king', 'wizard', 'chad', 'bull', 'bear', 'whale', 'vc', 
                     'founder', 'maxi', 'dude', 'ser', 'enjoyer', 'collector'];
      
      // Either prefix+suffix or just prefix
      const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      
      if (Math.random() < 0.3) {
        // 30% chance of just using the prefix
        return randomPrefix + '.eth';
      } else {
        // 70% chance of prefix+suffix
        const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        return randomPrefix + randomSuffix + '.eth';
      }
    }
    
    // Wallet fragment class for address animation
    class WalletFragment {
      constructor() {
        this.walletText = generateWalletFragment();
        this.x = -200 - (Math.random() * 500); // Start off-screen to the left
        
        // Spread addresses across the entire y-axis with better distribution
        // Divide the canvas height into 5 sections and place addresses in these sections
        const section = Math.floor(Math.random() * 5); // 0-4
        const sectionHeight = addressHeight / 5;
        this.y = (section * sectionHeight) + (Math.random() * sectionHeight);
        
        // Slow down the animation speed
        this.speedX = 0.5 + Math.random() * 1.0;  // Slower speed
        
        this.opacity = 0.8 + Math.random() * 0.2;
        this.size = 12 + Math.floor(Math.random() * 4);
        this.color = Math.random() > 0.85 ? baseBlue : '#ffffff';
        this.hasPassedFilter = false;
        this.insights = [];
      }
      
      update() {
        // If not yet at filter, move toward it
        if (!this.hasPassedFilter) {
          this.x += this.speedX;
          
          // Check if fragment has reached the filter
          if (this.x > addressWidth / 2 - 20) {
            this.hasPassedFilter = true;
            this.generateInsights();
          }
        } else {
          // Update insights
          for (let insight of this.insights) {
            insight.x += insight.speedX;
            insight.opacity = Math.max(0, insight.opacity - 0.002); // Slower fade for more visibility
          }
        }
        
        // Remove fragment if all insights have faded or gone off-screen
        return !(this.hasPassedFilter && this.insights.every(i => i.opacity <= 0 || i.x > addressWidth));
      }
      
      draw() {
        // Draw wallet fragment
        addressCtx.font = `${this.size}px monospace`;
        addressCtx.fillStyle = this.color;
        addressCtx.globalAlpha = this.hasPassedFilter ? this.opacity * 0.3 : this.opacity;
        addressCtx.fillText(this.walletText, this.x, this.y);
        addressCtx.globalAlpha = 1.0;
        
        // Draw insights if passed filter
        if (this.hasPassedFilter && this.insights.length > 0) {
          // Calculate fan-out positions for insights
          const fanRadius = 150; // Larger radius for fan
          const fanAngleStart = -Math.PI/3; // Wider start angle (upper right)
          const fanAngleEnd = Math.PI/3;    // Wider end angle (lower right)
          
          // Get shortened wallet name for display
          const displayWallet = this.walletText.length > 15 
            ? this.walletText.substring(0, 13) + '...' 
            : this.walletText;
            
          // Update insight positions if needed for fan effect
          if (!this.fanPositionsSet) {
            const angleDelta = (fanAngleEnd - fanAngleStart) / (this.insights.length - 1 || 1);
            
            for (let i = 0; i < this.insights.length; i++) {
              const angle = fanAngleStart + (angleDelta * i);
              const insightX = this.x + 100 + Math.cos(angle) * fanRadius;
              const insightY = this.y + Math.sin(angle) * fanRadius;
              
              this.insights[i].targetX = insightX;
              this.insights[i].targetY = insightY;
              
              // Add slight movement toward target
              const dx = (this.insights[i].targetX - this.insights[i].x) * 0.08;
              const dy = (this.insights[i].targetY - this.insights[i].y) * 0.08;
              
              this.insights[i].x += dx;
              this.insights[i].y += dy;
            }
            
            this.fanPositionsSet = true;
          }
        
          // Draw each insight
          for (let i = 0; i < this.insights.length; i++) {
            const insight = this.insights[i];
            
            // Draw insight text
            addressCtx.font = `${this.size - 2}px sans-serif`;
            addressCtx.fillStyle = insight.color;
            addressCtx.globalAlpha = insight.opacity;
            addressCtx.fillText(insight.text, insight.x, insight.y);
            
            // Draw connection line from wallet to insight
            addressCtx.beginPath();
            addressCtx.strokeStyle = insight.color;
            addressCtx.lineWidth = 1;
            addressCtx.globalAlpha = insight.opacity * 0.5;
            addressCtx.moveTo(this.x + this.walletText.length * 5, this.y);
            addressCtx.lineTo(insight.x, insight.y);
            addressCtx.stroke();
          }
          
          addressCtx.globalAlpha = 1.0;
        }
      }
      
      generateInsights() {
        // Create a grouped set of insights for this wallet
        
        // Colors for different insight types
        const colors = {
          github: baseBlue,     // Blue for Github
          farcaster: '#FFD700', // Yellow for Farcaster
          gitcoin: '#FF4500'    // Red for Gitcoin
        };
        
        // Create 3-4 grouped insights for this wallet
        const insightGroup = [];
        
        // Always include Github developer
        insightGroup.push({
          text: "Github developer",
          color: colors.github,
          type: 'github'
        });
        
        // Add Farcaster OG if random
        if (Math.random() > 0.3) {
          insightGroup.push({
            text: "Farcaster OG",
            color: colors.farcaster,
            type: 'farcaster'
          });
        }
        
        // Add Gitcoin Donor if random
        if (Math.random() > 0.4) {
          insightGroup.push({
            text: "Gitcoin Donor",
            color: colors.gitcoin,
            type: 'gitcoin'
          });
        }
        
        // Add random extra tags
        const extraTags = ['DeFi User', 'NFT Collector', 'DAO Voter', 'L2 Bridge User', 'Staker'];
        if (Math.random() > 0.5) {
          const randomTag = extraTags[Math.floor(Math.random() * extraTags.length)];
          insightGroup.push({
            text: randomTag,
            color: '#FFFFFF',
            type: 'tag'
          });
        }
        
        // Position insights at the filter point initially
        const baseY = this.y;
        const baseX = addressWidth / 2;
        
        // Add all insights to the array with proper positioning for fan effect
        for (let i = 0; i < insightGroup.length; i++) {
          const insight = insightGroup[i];
          this.insights.push({
            text: insight.text,
            x: baseX,
            y: baseY,  // All start at same point for fan effect
            targetX: 0, // Will be set in draw()
            targetY: 0, // Will be set in draw()
            speedX: 0.7 + Math.random() * 0.5, // Faster insight movement
            color: insight.color,
            opacity: 1.0,
            type: insight.type
          });
        }
      }
    }
    
    // Array to store wallet fragments
    const walletFragments = [];
    
    // Animation loop for address animation
    function animateAddressAnimation() {
      if (!addressAnimationCanvas || !addressCtx) return;
      
      // Clear canvas
      addressCtx.clearRect(0, 0, addressWidth, addressHeight);
      
      // Add new wallet fragments randomly but less frequently
      if (walletFragments.length < 10 && Math.random() < 0.02) {
        walletFragments.push(new WalletFragment());
      }
      
      // Update and draw wallet fragments
      for (let i = walletFragments.length - 1; i >= 0; i--) {
        const fragment = walletFragments[i];
        const keepFragment = fragment.update();
        fragment.draw();
        
        if (!keepFragment) {
          walletFragments.splice(i, 1);
        }
      }
      
      // Draw filter line in the middle
      addressCtx.beginPath();
      addressCtx.moveTo(addressWidth / 2, 0);
      addressCtx.lineTo(addressWidth / 2, addressHeight);
      addressCtx.strokeStyle = scannerBlue;
      addressCtx.lineWidth = 2;
      addressCtx.globalAlpha = 0.7;
      addressCtx.stroke();
      addressCtx.globalAlpha = 1.0;
      
      // Request next frame
      requestAnimationFrame(animateAddressAnimation);
    }
    
    // Platform class
    class Platform {
      constructor(type) {
        this.name = type.name;
        this.color = type.color;
        this.x = howWidth / 2;
        this.y = howHeight / 2 + (Math.random() * 80 - 40);
        this.size = 20;
        this.pulseSize = 0;
        this.pulseMax = 30;
        this.pulseGrowing = true;
      }
      
      update() {
        // Pulse effect
        if (this.pulseGrowing) {
          this.pulseSize += 0.5;
          if (this.pulseSize >= this.pulseMax) {
            this.pulseGrowing = false;
          }
        } else {
          this.pulseSize -= 0.5;
          if (this.pulseSize <= 0) {
            this.pulseGrowing = true;
          }
        }
      }
      
      draw() {
        // Draw pulse
        howCtx.beginPath();
        howCtx.arc(this.x, this.y, this.size + this.pulseSize, 0, Math.PI * 2);
        howCtx.fillStyle = `rgba(${hexToRgb(this.color)}, 0.1)`;
        howCtx.fill();
        
        // Draw platform
        howCtx.beginPath();
        howCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        howCtx.fillStyle = this.color;
        howCtx.fill();
        
        // Draw label
        howCtx.font = "12px sans-serif";
        howCtx.fillStyle = "#ffffff";
        howCtx.textAlign = "center";
        howCtx.fillText(this.name, this.x, this.y + this.size + 15);
      }
    }
    
    // Draw insight card
    function drawInsightCard(insight) {
      // Skip if not visible
      if (insight.opacity <= 0) return;
      
      // Fade in
      if (insight.opacity < insight.targetOpacity) {
        insight.opacity += 0.05;
      }
      
      // Card background
      howCtx.globalAlpha = insight.opacity;
      howCtx.fillStyle = 'rgba(10, 10, 15, 0.9)';
      howCtx.strokeStyle = insight.platform.color;
      howCtx.lineWidth = 2;
      
      // Draw rounded rectangle
      roundRect(
        howCtx, 
        insight.x, 
        insight.y, 
        insight.width, 
        insight.height, 
        4, 
        true, 
        true
      );
      
      // Card header
      howCtx.fillStyle = `rgba(${hexToRgb(insight.platform.color)}, 0.3)`;
      roundRect(
        howCtx, 
        insight.x, 
        insight.y, 
        insight.width, 
        24, 
        4, 
        true, 
        false,
        true
      );
      
      // Header text
      howCtx.fillStyle = '#ffffff';
      howCtx.font = '10px sans-serif';
      howCtx.textAlign = 'left';
      howCtx.fillText(insight.platform.name, insight.x + 10, insight.y + 16);
      
      // Content
      howCtx.fillStyle = '#aaaaaa';
      howCtx.font = '10px sans-serif';
      howCtx.fillText(insight.content.title, insight.x + 10, insight.y + 40);
      
      howCtx.fillStyle = '#ffffff';
      howCtx.font = '12px sans-serif';
      howCtx.fillText(insight.content.value, insight.x + 10, insight.y + 60);
      
      // Connection line
      howCtx.beginPath();
      howCtx.moveTo(insight.x + insight.width/2, insight.y + insight.height);
      howCtx.lineTo(insight.wallet.x, insight.wallet.y);
      howCtx.strokeStyle = insight.platform.color;
      howCtx.lineWidth = 1;
      howCtx.setLineDash([2, 2]);
      howCtx.stroke();
      howCtx.setLineDash([]);
      
      // Reset opacity
      howCtx.globalAlpha = 1.0;
    }
    
    // Utility to draw rounded rectangle
    function roundRect(ctx, x, y, width, height, radius, fill, stroke, noBottom = false) {
      if (typeof radius === 'undefined') {
        radius = 5;
      }
      
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      
      if (noBottom) {
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
      } else {
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      }
      
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      
      if (fill) {
        ctx.fill();
      }
      if (stroke) {
        ctx.stroke();
      }
    }
    
    // Utility to convert hex color to rgb
    function hexToRgb(hex) {
      // Remove # if present
      hex = hex.replace('#', '');
      
      // Parse r, g, b values
      const r = parseInt(hex.substring(0, 2), 16) || 0;
      const g = parseInt(hex.substring(2, 4), 16) || 0;
      const b = parseInt(hex.substring(4, 6), 16) || 0;
      
      return `${r}, ${g}, ${b}`;
    }
    
    // Animation loop for how it works visualization
    function animateHowItWorks() {
      if (!howCtx) return;
      
      // Clear canvas
      howCtx.clearRect(0, 0, howWidth, howHeight);
      
      // Draw section dividers
      howCtx.beginPath();
      howCtx.moveTo(howWidth * 0.33, 0);
      howCtx.lineTo(howWidth * 0.33, howHeight);
      howCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      howCtx.lineWidth = 1;
      howCtx.stroke();
      
      howCtx.beginPath();
      howCtx.moveTo(howWidth * 0.66, 0);
      howCtx.lineTo(howWidth * 0.66, howHeight);
      howCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      howCtx.stroke();
      
      // Update and draw platforms
      platforms.forEach(platform => {
        platform.update();
        platform.draw();
      });
      
      // Update and draw wallets
      howWallets.forEach(wallet => {
        wallet.update();
        wallet.draw();
      });
      
      // Update and draw insights
      insights.forEach(insight => {
        drawInsightCard(insight);
      });
      
      // Add new wallets as needed
      if (howWallets.length < 10 && Math.random() < 0.05) {
        const newWallet = new HowWallet(-100, 0);
        howWallets.push(newWallet);
      }
      
      // Remove insights that have moved too far
      for (let i = insights.length - 1; i >= 0; i--) {
        const insight = insights[i];
        if (insight.wallet.x > howWidth + 200) {
          insights.splice(i, 1);
        }
      }
      
      // Request next frame
      requestAnimationFrame(animateHowItWorks);
    }
    
    // Initialize main animation
    function initialize() {
      // Create initial wallets for main animation with pre-positioned locations
      // This avoids the initial aggressive movement
      for (let i = 0; i < 30; i++) {
        const wallet = new Wallet();
        // Set initial velocities to 0 to prevent initial jump
        wallet.vx = 0;
        wallet.vy = 0;
        wallets.push(wallet);
      }
      
      // Start main animation
      animate();
      
      // Add more wallets gradually (at a much slower rate)
      let addedCount = 30; // Start with fewer wallets
      const walletInterval = setInterval(() => {
        if (addedCount < maxWallets) {
          const wallet = new Wallet();
          // Set initial velocities to 0 to prevent initial jump
          wallet.vx = 0;
          wallet.vy = 0;
          wallets.push(wallet);
          addedCount++;
          
          // Update connections periodically
          if (addedCount % 5 === 0) {
            createConnections();
          }
        } else {
          clearInterval(walletInterval);
          // Create final connections once all wallets are added
          createConnections();
        }
      }, 300); // Much slower addition rate (300ms instead of 50ms)
      
      // Start cycling queries after a delay
      setTimeout(() => {
        // Start with first query
        // Make sure the query box is visible and ready
        queryText.style.opacity = 1;
        queryText.textContent = "";
        queryStatusText.textContent = "Ready to search...";
        // Add a CSS class to ensure text-align is left
        queryText.style.textAlign = 'left';
        queryText.style.display = 'inline-block';
        typeWriter(queries[0]);
      }, 1500);
      
      // Initialize address animation visualization
      if (addressCtx) {
        initAddressAnimation();
      }
    }
    
    // Initialize how it works visualization
    function initHowItWorksViz() {
      // Create platforms in the middle
      platformTypes.forEach((type, index) => {
        const platform = new Platform(type);
        
        // Position vertically based on index
        const spacing = howHeight / (platformTypes.length + 1);
        platform.y = spacing * (index + 1);
        
        platforms.push(platform);
      });
      
      // Create initial wallets
      for (let i = 0; i < 5; i++) {
        const x = -100 - (Math.random() * 200);
        const wallet = new HowWallet(x, 0);
        howWallets.push(wallet);
      }
      
      // Start how it works animation
      animateHowItWorks();
    }
    
    // Initialize address animation visualization
    function initAddressAnimation() {
      if (!addressAnimationCanvas || !addressCtx) return;
      
      // Clear any existing wallet fragments
      walletFragments.length = 0;
      
      // Add initial wallet fragments with better distribution
      // Create one wallet fragment for each section of the canvas
      const sections = 5;
      for (let i = 0; i < sections; i++) {
        const fragment = new WalletFragment();
        // Override the random y position to ensure even distribution
        const sectionHeight = addressHeight / sections;
        fragment.y = (i * sectionHeight) + (sectionHeight / 2);
        // Stagger the x positions
        fragment.x = -200 - (i * 150);
        walletFragments.push(fragment);
      }
      
      // Start animation
      animateAddressAnimation();
    }
    
    // Start the application
    initialize();
  });
