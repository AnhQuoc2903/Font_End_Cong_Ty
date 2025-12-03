// src/components/AnalyzeModal.tsx
import React from "react";
import { Modal, List, Tag, Typography, Spin, Empty } from "antd";

type AnalyzeResult = {
  labels?: string[];
  webEntities?: string[];
  pages?: { url?: string; title?: string }[];
  similarImages?: string[];
  texts?: string[];
};

const { Paragraph } = Typography;

const AnalyzeModal: React.FC<{ open: boolean; onClose: () => void; loading?: boolean; result?: AnalyzeResult | null; imageUrl?: string | null; }> = ({ open, onClose, loading, result, imageUrl }) => {
  return (
    <Modal open={open} onCancel={onClose} footer={null} width={920} title="Phân tích ảnh bằng AI">
      {loading && <div style={{textAlign:'center', padding:20}}><Spin /> Đang phân tích...</div>}
      {!loading && !result && <Empty description="Không có kết quả" />}
      {!loading && result && (
        <div style={{display:'grid', gridTemplateColumns:'340px 1fr', gap:16}}>
          <div>
            {imageUrl ? <img src={imageUrl} alt="analyzed" style={{width:'100%', borderRadius:8}} /> : <div style={{width:'100%',height:240,background:'#f5f5f5'}} />}
            <div style={{marginTop:12}}>
              <h4>Labels</h4>
              {result.labels && result.labels.length ? result.labels.map(l => <Tag key={l}>{l}</Tag>) : <div style={{color:'#888'}}>Không tìm thấy</div>}
            </div>
          </div>
          <div>
            <h4>Web Entities</h4>
            {result.webEntities && result.webEntities.length ? result.webEntities.map(w => <Tag key={w} color="green" style={{marginBottom:6}}>{w}</Tag>) : <div style={{color:'#888'}}>Không có</div>}
            <h4 style={{marginTop:12}}>Detected Text</h4>
            {(result.texts || []).length ? (result.texts || []).map((t,i) => <Paragraph key={i} copyable>{t}</Paragraph>) : <div style={{color:'#888'}}>Không có</div>}
            <h4 style={{marginTop:12}}>Pages</h4>
            <List dataSource={result.pages || []} renderItem={p => <List.Item><a href={p.url} target="_blank" rel="noreferrer">{p.title || p.url}</a></List.Item>} />
            <h4 style={{marginTop:12}}>Similar Images</h4>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{(result.similarImages||[]).map((s,i)=> <a key={i} href={s} target="_blank" rel="noreferrer"><img src={s} style={{width:96,height:64,objectFit:'cover',borderRadius:6}} alt="" /></a>)}</div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AnalyzeModal;
