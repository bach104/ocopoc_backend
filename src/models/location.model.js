const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    ten: {
      type: String,
      required: [true, 'Vui lòng nhập tên địa điểm'],
      trim: true
    },
    nhomSanPham: {
      type: String,
      required: [true, 'Vui lòng chọn nhóm sản phẩm'],
      enum: [
        'Chè OCOP', 
        'Cây ăn quả', 
        'Rau an toàn', 
        'Cây công nghiệp', 
        'Chăn nuôi',
        'Nông sản chế biến',
        'Thực phẩm sạch',
        'Nông sản truyền thống'
      ],
      default: 'Chè OCOP'
    },
    sanPhamTieuBieu: {
      type: String,
      trim: true
    },
    diaChi: {
      type: String,
      required: [true, 'Vui lòng nhập địa chỉ']
    },
    lat: {
      type: Number,
      required: [true, 'Vui lòng nhập vĩ độ']
    },
    lng: {
      type: Number,
      required: [true, 'Vui lòng nhập kinh độ']
    },
    lienHe: {
      type: String,
      trim: true
    },
    soDienThoai: {
      type: String,
      trim: true
    },
    gioMoCua: {
      type: String,
      default: '08:00 – 17:00'
    },
    xepHang: {
      type: String,
      enum: ['5 sao', '4 sao', '3 sao'],
      default: '3 sao'
    },
    image: {
      type: String,
      default: 'https://picsum.photos/seed/location/600/400'
    },
    huyen: {
      type: String,
      required: [true, 'Vui lòng nhập huyện/TP']
    },
    
    // LIÊN KẾT VỚI USER
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Virtual để lấy thông tin user chi tiết
locationSchema.virtual('creator', {
  ref: 'User',
  localField: 'createdBy',
  foreignField: '_id',
  justOne: true
});

locationSchema.virtual('updater', {
  ref: 'User',
  localField: 'updatedBy',
  foreignField: '_id',
  justOne: true
});

// Để virtuals hoạt động với toJSON và toObject
locationSchema.set('toJSON', { virtuals: true });
locationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Location', locationSchema);