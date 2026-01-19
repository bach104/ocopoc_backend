
const Location = require('../models/location.model');
const { colorize } = require('../utils/colors');

// Lấy tất cả địa điểm
const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username email role')
      .populate('updatedBy', 'username email role');
    
    console.log(colorize.info(`Đã lấy ${locations.length} địa điểm`));
    
    res.json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    console.log(colorize.error(error.message));
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Lấy địa điểm theo ID
const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id)
      .populate('createdBy', 'username email role')
      .populate('updatedBy', 'username email role');
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa điểm'
      });
    }
    
    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    console.log(colorize.error(error.message));
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Tạo địa điểm mới
const createLocation = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện thao tác này'
      });
    }

    const locationData = {
      ...req.body,
      createdBy: req.user._id
    };

    const location = await Location.create(locationData);
    
    // Populate thông tin user sau khi tạo
    await location.populate('createdBy', 'username email role');
    
    console.log(colorize.success(`Đã tạo địa điểm mới: ${location.ten} bởi ${req.user.username}`));
    
    res.status(201).json({
      success: true,
      message: 'Đã tạo địa điểm thành công',
      data: location
    });
  } catch (error) {
    console.log(colorize.error(error.message));
    
    // Xử lý lỗi validation
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Lỗi validation',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Cập nhật địa điểm
const updateLocation = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện thao tác này'
      });
    }

    let location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa điểm'
      });
    }

    const updateData = {
      ...req.body,
      updatedBy: req.user._id
    };

    location = await Location.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    )
    .populate('createdBy', 'username email role')
    .populate('updatedBy', 'username email role');
    
    console.log(colorize.info(`Đã cập nhật địa điểm: ${location.ten} bởi ${req.user.username}`));
    
    res.json({
      success: true,
      message: 'Đã cập nhật địa điểm thành công',
      data: location
    });
  } catch (error) {
    console.log(colorize.error(error.message));
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Lỗi validation',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Xóa địa điểm
const deleteLocation = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện thao tác này'
      });
    }

    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa điểm'
      });
    }

    await location.deleteOne();
    
    console.log(colorize.warning(`Đã xóa địa điểm: ${location.ten} bởi ${req.user.username}`));
    
    res.json({
      success: true,
      message: 'Đã xóa địa điểm thành công',
      data: {
        id: location._id,
        ten: location.ten
      }
    });
  } catch (error) {
    console.log(colorize.error(error.message));
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Lấy địa điểm theo user (người tạo)
const getLocationsByUser = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    const locations = await Location.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username email role')
      .populate('updatedBy', 'username email role');
    
    console.log(colorize.info(`Đã lấy ${locations.length} địa điểm của user ${userId}`));
    
    res.json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    console.log(colorize.error(error.message));
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Lấy địa điểm theo nhóm sản phẩm
const getLocationsByProductGroup = async (req, res) => {
  try {
    const { group } = req.params;
    
    const locations = await Location.find({ nhomSanPham: group })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username email role')
      .populate('updatedBy', 'username email role');
    
    console.log(colorize.info(`Đã lấy ${locations.length} địa điểm thuộc nhóm ${group}`));
    
    res.json({
      success: true,
      count: locations.length,
      group: group,
      data: locations
    });
  } catch (error) {
    console.log(colorize.error(error.message));
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

module.exports = {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  getLocationsByUser,
  getLocationsByProductGroup
};