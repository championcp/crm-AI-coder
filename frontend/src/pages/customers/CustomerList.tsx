/**
 * 客户列表页面
 * 展示客户数据，支持搜索、筛选、分页等功能
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Input,
  Select,
  Table,
  Space,
  Tag,
  Pagination,
  Typography,
  Row,
  Col,
  Tooltip,
  message
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { customerService } from '../../services/api';
import type { Customer, CustomerQueryParams } from '../../types';

const { Title } = Typography;
const { Option } = Select;

/**
 * 客户列表页面组件
 */
const CustomerList: React.FC = () => {
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 客户数据列表
  const [dataSource, setDataSource] = useState<Customer[]>([]);
  // 总记录数
  const [total, setTotal] = useState(0);
  // 当前页码
  const [currentPage, setCurrentPage] = useState(1);
  // 每页条数
  const [pageSize, setPageSize] = useState(10);
  
  // 搜索关键词
  const [keyword, setKeyword] = useState('');
  // 客户等级筛选
  const [level, setLevel] = useState<string>('');
  // 客户状态筛选
  const [status, setStatus] = useState<string>('');
  // 行业筛选
  const [industry, setIndustry] = useState<string>('');

  /**
   * 页面加载时获取客户数据
   */
  useEffect(() => {
    fetchCustomerList();
  }, [currentPage, pageSize]);

  /**
   * 获取客户列表数据
   */
  const fetchCustomerList = async () => {
    try {
      setLoading(true);
      const params: CustomerQueryParams = {
        page: currentPage,
        pageSize: pageSize,
        keyword: keyword || undefined,
        level: level as any || undefined,
        status: status as any || undefined,
        industry: industry || undefined
      };
      
      const response = await customerService.getList(params);
      if (response.code === 200 && response.data) {
        setDataSource(response.data.list || []);
        setTotal(response.data.total || 0);
      } else {
        message.error(response.message || '获取客户列表失败');
      }
    } catch (error) {
      console.error('获取客户列表失败:', error);
      message.error('获取客户列表失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理搜索
   */
  const handleSearch = () => {
    setCurrentPage(1);
    fetchCustomerList();
  };

  /**
   * 处理重置
   */
  const handleReset = () => {
    setKeyword('');
    setLevel('');
    setStatus('');
    setIndustry('');
    setCurrentPage(1);
    // 延迟执行查询以等待状态更新
    setTimeout(() => {
      fetchCustomerList();
    }, 0);
  };

  /**
   * 处理分页变化
   */
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) {
      setPageSize(size);
    }
  };

  /**
   * 查看客户详情
   */
  const handleView = (record: Customer) => {
    message.info(`查看客户: ${record.name}`);
    // TODO: 跳转到客户详情页
  };

  /**
   * 编辑客户
   */
  const handleEdit = (record: Customer) => {
    message.info(`编辑客户: ${record.name}`);
    // TODO: 打开编辑弹窗或跳转编辑页
  };

  /**
   * 删除客户
   */
  const handleDelete = (record: Customer) => {
    // TODO: 实现删除确认弹窗
    console.log('删除客户:', record.id);
  };

  /**
   * 新建客户
   */
  const handleCreate = () => {
    message.info('新建客户');
    // TODO: 打开新建弹窗或跳转新建页
  };

  /**
   * 获取客户等级对应的颜色
   */
  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'A': 'red',
      'B': 'orange',
      'C': 'blue',
      'D': 'default'
    };
    return colors[level] || 'default';
  };

  /**
   * 获取客户状态对应的颜色
   */
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      '潜在客户': 'blue',
      '正式客户': 'green',
      '重点客户': 'red',
      '流失客户': 'default'
    };
    return colors[status] || 'default';
  };

  /**
   * 表格列定义
   */
  const columns = [
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
      fixed: 'left' as const
    },
    {
      title: '客户编码',
      dataIndex: 'code',
      key: 'code',
      width: 120
    },
    {
      title: '客户等级',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: string) => (
        <Tag color={getLevelColor(level)}>{level}级</Tag>
      )
    },
    {
      title: '客户状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      )
    },
    {
      title: '所属行业',
      dataIndex: 'industry',
      key: 'industry',
      width: 120,
      ellipsis: true
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      key: 'contactName',
      width: 100
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 140
    },
    {
      title: '负责人',
      dataIndex: ['owner', 'realName'],
      key: 'owner',
      width: 100,
      render: (_: any, record: Customer) => record.owner?.realName || '-'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: Customer) => (
        <Space size="small">
          <Tooltip title="查看">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              type="text" 
              danger
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* 页面标题 */}
      <Title level={4} style={{ marginBottom: 24 }}>客户管理</Title>

      <Card style={{ marginBottom: 16 }}>
        {/* 搜索栏 */}
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6} lg={5}>
            <Input
              placeholder="请输入客户名称/编码"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={handleSearch}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={4} lg={4}>
            <Select
              placeholder="客户等级"
              value={level || undefined}
              onChange={(value) => setLevel(value)}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="A">A级</Option>
              <Option value="B">B级</Option>
              <Option value="C">C级</Option>
              <Option value="D">D级</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4} lg={4}>
            <Select
              placeholder="客户状态"
              value={status || undefined}
              onChange={(value) => setStatus(value)}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="潜在客户">潜在客户</Option>
              <Option value="正式客户">正式客户</Option>
              <Option value="重点客户">重点客户</Option>
              <Option value="流失客户">流失客户</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4} lg={4}>
            <Select
              placeholder="所属行业"
              value={industry || undefined}
              onChange={(value) => setIndustry(value)}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="互联网">互联网</Option>
              <Option value="金融">金融</Option>
              <Option value="制造">制造</Option>
              <Option value="教育">教育</Option>
              <Option value="医疗">医疗</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={7}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        {/* 操作栏 */}
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建客户
          </Button>
        </div>

        {/* 数据表格 */}
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: 1200 }}
          locale={{
            emptyText: '暂无数据'
          }}
        />

        {/* 分页组件 */}
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 条`}
            onChange={handlePageChange}
            pageSizeOptions={['10', '20', '50', '100']}
          />
        </div>
      </Card>
    </div>
  );
};

export default CustomerList;
