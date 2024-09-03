import { BarcodeOutlined, CameraOutlined } from '@ant-design/icons'
import { Button, Col, Image, Input, Modal, Row, Form, Divider, message } from 'antd'

const DeviceSelectModal = (props: {
  isMemberVisit?: any
  isMemberRenewSelectModalVisible?: any
  hideMemberRenewSelectModal?: any
  showMemberRenewDeviceModal?: any
  showMemberRenewCameraModal?: any
}) => {
  const {
    isMemberVisit,
    isMemberRenewSelectModalVisible,
    hideMemberRenewSelectModal,
    showMemberRenewDeviceModal,
    showMemberRenewCameraModal,
  } = props
  return (
    <>
      <Modal
        title={isMemberVisit ? '来店記録' : '会員更新'}
        open={isMemberRenewSelectModalVisible}
        onCancel={hideMemberRenewSelectModal}
        footer={null}
        destroyOnClose
        centered
        styles={{
          body: {
            maxHeight: '80vh',
            overflowY: 'auto',
            overflowX: 'hidden',
          }
        }}
      >
        <Row justify='center' gutter={[16, 16]}>
          <Col>
            <Button
              type='primary'
              size='large'
              style={{ height: '100px', width: '160px' }}
              icon={<BarcodeOutlined rev={undefined} />}
              onClick={showMemberRenewDeviceModal}
            >
              装置と手入力
            </Button>
          </Col>

          <Col>
            <Button
              type='primary'
              size='large'
              style={{ height: '100px', width: '160px' }}
              icon={<CameraOutlined rev={undefined} />}
              onClick={showMemberRenewCameraModal}
            >
              カメラ
            </Button>
          </Col>
        </Row>
        <Divider />
        <Row justify='center'>
          <Col>
            <Button className='px-12' size='large' onClick={hideMemberRenewSelectModal}>
              閉じる
            </Button>
          </Col>
        </Row>
      </Modal>
    </>
  )
}

export default DeviceSelectModal
