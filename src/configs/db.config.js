const mongoose = require('mongoose');
const { colors, colorize } = require('../utils/colors');

const connectDB = async () => {
  try {
    console.log(`\n${colors.cyan}${colors.bright}🔄 Đang kết nối đến MongoDB...${colors.reset}`);
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log(`║  ${colors.bgGreen}${colors.bright}${colors.white} ✓ KẾT NỐI THÀNH CÔNG ${colors.reset}                                      ║`);
    console.log('╠════════════════════════════════════════════════════════════════╣');
    console.log(`║  ${colors.green}📦 Database:${colors.reset} ${colors.cyan}${conn.connection.name}${colors.reset}                                   ║`);
    console.log(`║  ${colors.green}🌐 Host:${colors.reset}     ${colors.cyan}${conn.connection.host}${colors.reset}          ║`);
    console.log(`║  ${colors.green}🔌 Port:${colors.reset}     ${colors.cyan}${conn.connection.port}${colors.reset}                                    ║`);
    console.log(`║  ${colors.green}⚡ Status:${colors.reset}   ${colors.yellow}${conn.connection.readyState === 1 ? 'Connected ✓' : 'Disconnected ✗'}${colors.reset}                            ║`);
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    
    mongoose.connection.on('connected', () => {
      console.log(colorize.success('MongoDB event: Connected'));
    });
    
    mongoose.connection.on('error', (err) => {
      console.log(colorize.error(`MongoDB event: Error - ${err.message}`));
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log(colorize.warning('MongoDB event: Disconnected'));
    });
    
  } catch (error) {
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log(`║  ${colors.bgRed}${colors.bright}${colors.white} ✗ KẾT NỐI THẤT BẠI ${colors.reset}                                       ║`);
    console.log('╠════════════════════════════════════════════════════════════════╣');
    console.log(`║  ${colors.red}❌ Error:${colors.reset} ${error.message.substring(0, 47)}${colors.reset}           ║`);
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    console.error(`${colors.red}${colors.bright}📋 Chi tiết lỗi:${colors.reset}`);
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;