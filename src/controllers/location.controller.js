const Location = require('../models/location.model');
const { colorize } = require('../utils/colors');

// Lấy tất cả địa điểm
const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    
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
    const location = await Location.findById(req.params.id);
    
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

const createLocation = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện thao tác này'
      });
    }

    const location = await Location.create(req.body);
    
    console.log(colorize.success(`Đã tạo địa điểm mới: ${location.ten}`));
    
    res.status(201).json({
      success: true,
      message: 'Đã tạo địa điểm thành công',
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

// Cập nhật địa điểm (chỉ admin)
const updateLocation = async (req, res) => {
  try {
    // Kiểm tra quyền admin
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

    location = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    console.log(colorize.info(`Đã cập nhật địa điểm: ${location.ten}`));
    
    res.json({
      success: true,
      message: 'Đã cập nhật địa điểm thành công',
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

// Xóa địa điểm (chỉ admin)
const deleteLocation = async (req, res) => {
  try {
    // Kiểm tra quyền admin
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
    
    console.log(colorize.warning(`Đã xóa địa điểm: ${location.ten}`));
    
    res.json({
      success: true,
      message: 'Đã xóa địa điểm thành công'
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
  deleteLocation
};