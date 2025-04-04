document.addEventListener('DOMContentLoaded', () => {
    // Main animation canvas
    const canvas = document.getElementById('animationCanvas');
    const ctx = canvas.getContext('2d');
    
    // Query elements
    const queryText = document.getElementById('query-text');
    const queryStatusText = document.getElementById('query-status-text');
    const queryStatusIcon = document.querySelector('.query-status-icon');
    
    // How it works canvas
    const howItWorksCanvas = document.getElementById('howItWorksCanvas');
    const howCtx = howItWorksCanvas ? howItWorksCanvas.getContext('2d') : null;
  
    // Set canvas dimensions
    let width, height, howWidth, howHeight;
    function resizeCanvas() {
      // Main canvas
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      // How it works canvas
      if (howItWorksCanvas) {
        const container = howItWorksCanvas.parentElement;
        howWidth = container.clientWidth;
        howHeight = container.clientHeight;
        howItWorksCanvas.width = howWidth;
        howItWorksCanvas.height = howHeight;
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
    const maxWallets = 120;
    
    // Initialize how it works visualization
    const howWallets = [];
    const platforms = [];
    const insights = [];
    
    // Sample queries to cycle through
    const queries = [
      "Who is building dev tools for prediction markets on Base?",
      "What are the most interesting Arbitrum gaming hackathon projects?",
      "Who is doing the best writing on Web3 culture on Farcaster?"
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
        
        // Movement
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        
        // Add some oscillation to movement
        this.oscillateX = Math.random() < 0.5;
        this.oscillateY = Math.random() < 0.5;
        this.oscillationSpeed = 0.02 + Math.random() * 0.03;
        this.oscillationAmplitude = 0.5 + Math.random() * 1.5;
        this.oscillationOffset = Math.random() * Math.PI * 2;
        this.time = 0;
        
        this.size = 12 + Math.floor(Math.random() * 4);
        this.opacity = 0.4 + Math.random() * 0.4;
        this.highlighted = false;
      }
      
      update() {
        // Increment time for oscillation
        this.time += 0.01;
        
        // Apply base movement
        this.x += this.vx;
        this.y += this.vy;
        
        // Apply oscillation if enabled
        if (this.oscillateX) {
          this.x += Math.sin(this.time * this.oscillationSpeed + this.oscillationOffset) * this.oscillationAmplitude;
        }
        
        if (this.oscillateY) {
          this.y += Math.cos(this.time * this.oscillationSpeed + this.oscillationOffset) * this.oscillationAmplitude;
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
          queryStatusIcon.classList.remove('running');
          queryStatusIcon.classList.add('complete');
          
          // After a delay, clear for next query
          setTimeout(() => {
            clearAndTypeNextQuery();
          }, 4000);
        }, 1000);
      }
    }
    
    // Clear query and type the next one
    let currentQueryIndex = 0;
    function clearAndTypeNextQuery() {
      // Clear current query
      queryText.textContent = "";
      
      // Reset status
      queryStatusText.textContent = "Ready to search...";
      queryStatusIcon.classList.remove('complete');
      queryStatusIcon.classList.add('running');
      
      // Get next query
      currentQueryIndex = (currentQueryIndex + 1) % queries.length;
      const nextQuery = queries[currentQueryIndex];
      
      // Start typing after a delay
      setTimeout(() => {
        typeWriter(nextQuery);
      }, 500);
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
    
    // HOW IT WORKS VISUALIZATION
    
    // Wallet for how it works section
    class HowWallet {
      constructor(x, section) {
        this.address = Math.random() < 0.6 ? generateBuilderENS() : generateHexAddress();
        this.x = x;
        this.y = howHeight * 0.3 + (Math.random() * howHeight * 0.4);
        this.section = section; // 0 = left, 1 = middle, 2 = right
        this.vx = 1 + Math.random() * 1;
        this.opacity = 0.7 + Math.random() * 0.3;
        this.size = 10 + Math.floor(Math.random() * 4);
        this.targetPlatform = null; // Platform to connect to
        this.connecting = false;
        this.connected = false;
        this.insightGenerated = false;
        this.insight = null;
      }
      
      update() {
        // If on the left section, move right
        if (this.section === 0) {
          this.x += this.vx;
          
          // When reaching middle section
          if (this.x > howWidth * 0.33 && !this.connecting) {
            this.connecting = true;
            
            // Maybe connect to a platform
            if (Math.random() < 0.3 && platforms.length > 0) {
              const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
              this.targetPlatform = randomPlatform;
            }
          }
          
          // When reaching right section
          if (this.x > howWidth * 0.66) {
            this.section = 2;
            
            // If connected to a platform, maybe generate an insight
            if (this.targetPlatform && !this.insightGenerated && Math.random() < 0.7) {
              this.generateInsight();
            }
          }
        }
        
        // If off right edge, reset to left
        if (this.x > howWidth + 100) {
          this.reset();
        }
      }
      
      draw() {
        howCtx.globalAlpha = this.opacity;
        howCtx.font = `${this.size}px monospace`;
        
        // Color based on connection status
        if (this.targetPlatform) {
          howCtx.fillStyle = this.targetPlatform.color;
        } else {
          howCtx.fillStyle = "#ffffff";
        }
        
        // Draw wallet address
        howCtx.fillText(this.address, this.x, this.y);
        
        // Draw connection to platform if connecting
        if (this.connecting && this.targetPlatform) {
          howCtx.beginPath();
          howCtx.moveTo(this.x, this.y);
          howCtx.lineTo(this.targetPlatform.x, this.targetPlatform.y);
          howCtx.strokeStyle = this.targetPlatform.color;
          howCtx.lineWidth = 1;
          howCtx.setLineDash([2, 2]);
          howCtx.stroke();
          howCtx.setLineDash([]);
        }
        
        howCtx.globalAlpha = 1.0;
      }
      
      generateInsight() {
        this.insightGenerated = true;
        
        // Create insight card
        const insight = {
          x: this.x + 20,
          y: this.y - 60,
          width: 160,
          height: 100,
          opacity: 0,
          targetOpacity: 0.9,
          platform: this.targetPlatform,
          wallet: this,
          content: this.generateInsightContent()
        };
        
        insights.push(insight);
        this.insight = insight;
      }
      
      generateInsightContent() {
        // Generate appropriate content based on platform
        if (this.targetPlatform.name === "GitHub") {
          return {
            title: "Code Interest",
            value: "Contributor to prediction market protocols"
          };
        } else if (this.targetPlatform.name === "Farcaster") {
          return {
            title: "Social Activity",
            value: "Active in development discussions"
          };
        } else if (this.targetPlatform.name === "Mirror") {
          return {
            title: "Content Focus",
            value: "Web3 Music & NFTs"
          };
        }
        
        return {
          title: "Builder Signal",
          value: "Active in ecosystem"
        };
      }
      
      reset() {
        // Reset position to left side
        this.x = -100 - Math.random() * 200;
        this.y = howHeight * 0.3 + (Math.random() * howHeight * 0.4);
        this.section = 0;
        this.connecting = false;
        this.connected = false;
        this.targetPlatform = null;
        this.insightGenerated = false;
        this.insight = null;
      }
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
      // Create initial wallets for main animation
      for (let i = 0; i < 50; i++) {
        wallets.push(new Wallet());
      }
      
      // Start main animation
      animate();
      
      // Add more wallets gradually
      let addedCount = 50;
      const walletInterval = setInterval(() => {
        if (addedCount < maxWallets) {
          wallets.push(new Wallet());
          addedCount++;
          
          // Update connections periodically
          if (addedCount % 10 === 0) {
            createConnections();
          }
        } else {
          clearInterval(walletInterval);
          // Create final connections once all wallets are added
          createConnections();
        }
      }, 50);
      
      // Start cycling queries after a delay
      setTimeout(() => {
        // Start with first query
        typeWriter(queries[0]);
      }, 1000);
      
      // Initialize how it works visualization if available
      if (howCtx) {
        initHowItWorksViz();
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
    
    // Start the application
    initialize();
  });
