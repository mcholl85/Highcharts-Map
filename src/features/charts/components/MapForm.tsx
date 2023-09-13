import { Button, Col, Form, Input, InputNumber, Modal, Row } from "antd";
import { FormValues } from "../types/fomValues";
import { useState } from "react";

type MapFormProps = {
  onSubmit: (data: FormValues) => void;
  formValues: FormValues;
};

export const MapForm = ({ onSubmit, formValues }: MapFormProps) => {
  const [form] = Form.useForm();
  const onFinish = (values: FormValues) => {
    onSubmit(values);
    setIsModalOpen(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const onCancel = () => setIsModalOpen(false);

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Saisir les données
      </Button>

      <Modal
        title="Formulaire"
        open={isModalOpen}
        onCancel={onCancel}
        footer={null}
        width={"100%"}
      >
        <Form
          initialValues={formValues}
          form={form}
          name="mapForm"
          onFinish={onFinish}
        >
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item name={"title"} label={"Titre du graphique"}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={"label"} label={"Unité de mesure"}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[20, 10]}>
            {[...Object.entries(formValues)].map(([key, value], index) => (
              <Col span={24} sm={12} md={12} lg={6} xl={4} key={key + index}>
                <Form.Item name={key}>
                  <InputNumber
                    addonBefore={key}
                    style={{ width: "100%" }}
                    value={value}
                  />
                </Form.Item>
              </Col>
            ))}
          </Row>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>
    </>
  );
};
