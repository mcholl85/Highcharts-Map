import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
} from "antd";
import { FormValues } from "../types/fomValues";
import { useEffect, useMemo, useState } from "react";
import { ChartData } from "../types/chartData";
import { createFormValuesFromData } from "../utils/createFormValuesFromData";

type MapFormProps = {
  onSubmit: (formValues: FormValues) => void;
  data: ChartData;
};

export const MapForm = ({ onSubmit, data }: MapFormProps) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formValues = useMemo(() => createFormValuesFromData(data), [data]);
  const watchedValues = Form.useWatch([], form) as FormValues | undefined;

  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue(formValues);
    }
  }, [data, form, formValues, isModalOpen]);

  const onFinish = (values: FormValues) => {
    onSubmit(values);
    setIsModalOpen(false);
  };
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
        title={<div style={{ fontSize: "24px" }}>Formulaire</div>}
        open={isModalOpen}
        onCancel={onCancel}
        footer={null}
        width={"100%"}
        style={{ top: 16 }}
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

          <Row className="city-values-grid" gutter={[10, 6]}>
            {[...Object.entries(formValues)].map(([key]) => {
              const currentValue =
                typeof watchedValues?.[key] === "number"
                  ? watchedValues[key]
                  : formValues[key];
              const isZeroValue = currentValue === 0;

              return (
                <Col span={24} sm={12} md={12} lg={6} xl={4} key={key}>
                  <Form.Item
                    name={key}
                    className={
                      isZeroValue
                        ? "city-value-item city-value-item-zero"
                        : "city-value-item"
                    }
                  >
                  <InputNumber addonBefore={key} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              );
            })}
          </Row>

          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>
    </>
  );
};
