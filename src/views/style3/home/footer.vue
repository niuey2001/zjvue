<script>
export default {
    name: 'FooterBar',
    props: {
        messages: {
            type: Array,
            default: () => []
        },
        footerImage: {
            type: String,
            default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANYAAAAaCAYAAAG8zpJ3AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAA1qADAAQAAAABAAAAGgAAAAA+G3BHAAAJPElEQVR4Ae1cu68UVRifiyZSYE1AUIlIYggE4oOCmNjaUGhhbUJHQmypjA2WdMSAwYREiASCNLT+GdJJjBoTKy0ud+/uzvH7znd+5/GbnZ07u8MFlp2EOed87+eZs3N32aiy68P77mHlqk8VtLFRVc5hlEklgOxaBB8lHL81UYlyNQUbHPfF8a9CxObWFFPxyIln0Y7B1l7i/qubDg5FReJAcNWHdAh8Ml/8+ui+qIIGkQ7vkDt1fRl8VHb81ljUxGUMaZqoFcvhs5zVSa7MYjgLaFosgvemas4iM8JITgyCT7am2ak7U6f5UgW4sN6QUFo1AZOPaqHxgB5YrHeNH4oxHrupdaLGhTD6SlQswgpcPoIbdMDJ+hnxw1pv2aFrW6FMMgOjjciGjGJsDk62W5Zt6wn0OSG4doG/cMx7J7czD92halT9WrtqH2DeVe+TWZrtm6FkTZTCvaNhfBb8Zkmm+dSdeiqG7XmReytuh/BrPJnumd1HSqFZaruAizUnhJjnuKfPXzj13o/u3fFknLT6OoJhCsY8HxO5BQMOKLnMN0C7e/yFU1uj8SMzPDPM21Znj2fME018zsRMJpx3xYFH/cQ80QzNXzi1PZ7uad+99Glt3a/7n2/GsBmkuZ5N1A29idFqd1zvHr9XeeDqk8t15S6ZHfmhSY0XkmCjmqvzfHczJzwm+PEc8AdzOocP7rn/pExe94Q+FDILFYRCAtgHQQkjImA0GhnYL+QWA0PyIh4TjFBE9ACvqv7oH+LA48mfptcl6OcZrmscCX2VZgRtcJDsFA96lg94m5w2eBcf47F+XvQXeyCMy8ftcX2eMxobJhKWHZOcs085TB8aTFrKMKBPQTbBiQ8zhsMAw4MK8qpqtfTPTdbRm9tfTeS1QwoCglOOoECQXAhSWhs9kg55/iEhKP0Aplc8eAbCNn5PnN1edv3VOzfc4fF09LuPCaIcAkRLxNw/pJUEeHQQkoGHGOBBXHxmMRz4KDAAIB/4yBcQwAO+KvrhF/z244HvnsghyiUcTgDJe6PnNaQ'
        }
    },
    data() {
        return {
            showStationMessage: false,
            showEmptyState: true,
            showMorePopupEmptyState: false,
            showMorePopup: false,
            showFeedbackPopup: false,
            stationMessage: [],
            feedbackContent: ''
        }
    },

    methods: {
        toggleStationMessage() {
            this.showStationMessage = !this.showStationMessage;
            if (this.showStationMessage) {
                this.showMorePopup = false;
                this.showFeedbackPopup = false;
            }
        },
        toggleMorePopup() {
            this.showMorePopup = !this.showMorePopup;
            if (this.showMorePopup) {
                this.showStationMessage = false;
                this.showFeedbackPopup = false;
            }
        },
        toggleFeedbackPopup() {
            this.showFeedbackPopup = !this.showFeedbackPopup;
            if (this.showFeedbackPopup) {
                this.showStationMessage = false;
                this.showMorePopup = false;
            }
        },
        submitFeedback() {
            // 处理提交反馈的逻辑
            if (this.feedbackContent.trim()) {
                // 这里可以添加提交反馈到后端的代码
                this.$message.success('反馈已提交，谢谢！');
                this.feedbackContent = '';
                this.showFeedbackPopup = false;
            }
        }
    }
}
</script>

<template>
    <div class="footer">
        <span class="more-link" @click="toggleMorePopup">
            更多 >
        </span>
        <div class="footer-right" :style="{ backgroundImage: `url(${footerImage})` }">
            <span class="message-link" @click="toggleStationMessage">
                <i class="icon icon-message"></i>
                站内消息
            </span>
            <span class="divider">|</span>
            <span class="message-link" @click="toggleFeedbackPopup">
                <i class="icon icon-feedback"></i>
                功能反馈
            </span>
        </div>
    </div>

    <!-- 站内消息弹窗 -->
    <div class="station-message-popup" v-if="showStationMessage">
        <div class="station-message-container">
            <div class="station-message-header">
                站内消息 ({{ stationMessage.length }})
                <span class="close-btn" @click="toggleStationMessage">×</span>
            </div>
            <div class="station-message-content">
                <!-- 空状态 -->
                <div v-if="stationMessage.length === 0" class="empty-message-container">
                    <div class="bell-icon"></div>
                    <p class="empty-message-text">您的站内消息将出现在这里</p>
                    <p class="empty-message-subtext">您已读完所有消息。如有功能问题，请通过功能反馈与我们联系。</p>
                </div>

                <!-- 消息列表 -->
                <div v-else class="message-list">
                    <div v-for="(msg, index) in stationMessage" :key="msg.id" class="message-item">
                        <div class="message-number">{{ index + 1 }}</div>
                        <div class="message-content">
                            <div class="message-date">{{ msg.date }}</div>
                            <div class="message-text">{{ msg.message }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 更多弹窗遮罩层 -->
    <div class="overlay" v-if="showMorePopup" @click.self="showMorePopup ? toggleMorePopup() : toggleFeedbackPopup()">
    </div>

    <!-- 更多弹窗 - 居中显示 -->
    <div class="more-popup-centered" v-if="showMorePopup">
        <div class="close-btn-container">
            <span class="close-btn" @click="toggleMorePopup">×</span>
        </div>
        <div class="more-popup-container">
            <!-- Header section with bell icon -->
            <div class="popup-header">
                <div class="bell-icon-colored"></div>
            </div>
            <!-- Body section with message -->
            <div class="popup-body">
                <!-- <p class="no-message-text">暂无消息</p> -->

                <div class="station-message-content">
                    <!-- 空状态 -->
                    <div v-if="messages.length === 0">
                        <p class="no-message-text">暂无消息</p>
                    </div>
                    <!-- 消息列表 -->
                    <div v-else class="message-list">
                        <div v-for="(msg, index) in messages" :key="msg.id" class="message-item">
                            <!-- <div class="message-number">{{ index + 1 }}</div> -->
                            <div class="message-content">
                                <div class="message-date">{{ msg.date }}</div>
                                <div class="message-text">{{ msg.message }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 功能反馈弹窗 -->
    <div class="feedback-popup" v-if="showFeedbackPopup">
        <div class="feedback-container">
            <div class="feedback-header">
                功能反馈
                <span class="close-btn" @click="toggleFeedbackPopup">×</span>
            </div>
            <div class="feedback-content">
                <div class="feedback-form">
                    <div class="form-item">
                        <label class="required-label">反馈内容：</label>
                        <textarea class="feedback-textarea" placeholder="请输入反馈内容" v-model="feedbackContent"
                            maxlength="800"></textarea>
                        <div class="char-counter">{{ feedbackContent.length }}/800</div>
                    </div>
                    <div class="form-actions">
                        <button class="submit-btn" @click="submitFeedback">提交反馈</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.footer {
    height: 26px;
    min-height: 26px;
    flex-shrink: 0;
    /* 防止footer被压缩 */
    border-top: 1px solid #d9e8f8;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    bottom: 0;
    z-index: 100;
    background-color: #fff;
}

.footer-right {
    padding-right: 15px;
    color: white;
    font-size: 12px;
    display: flex;
    align-items: center;
    height: 26px;
    padding-left: 24px;
    padding-right: 15px;
    border-top-left-radius: 15px;
}

.more-link {
    cursor: pointer;
    margin-left: 10px;
    color: #555;
    font-size: 13px;
    display: flex;
    align-items: center;
    height: 26px;
}

.divider {
    margin: 0 8px;
    color: white;
}

.message-link {
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.more-link:hover,
.message-link:hover {
    text-decoration: underline;
}

/* 图标样式 */
.icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 4px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
}

.icon-message {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z'/%3E%3C/svg%3E");
}

.icon-feedback {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z'/%3E%3C/svg%3E");
}

/* 站内消息弹窗样式 */
.station-message-popup {
    position: fixed;
    bottom: 26px;
    right: 10px;
    z-index: 1000;
    width: 340px;
    height: 450px;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
}

.station-message-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.station-message-header {
    padding: 12px 15px;
    font-size: 16px;
    font-weight: 500;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.close-btn {
    cursor: pointer;
    font-size: 20px;
    color: #888;

}

.close-btn:hover {
    color: #333;
}

.station-message-content {
    flex: 1;
    overflow-y: auto;
    padding: 0;
}

/* 空状态样式 */
.empty-message-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* height: 100%; */
    padding: 20px;
    text-align: center;
}

.bell-icon {
    width: 60px;
    height: 60px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e0e0e0'%3E%3Cpath d='M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    margin-bottom: 20px;
}

.empty-message-text {
    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
}

.empty-message-subtext {
    font-size: 14px;
    color: #888;
    line-height: 1.5;
}

/* 消息列表样式 */
.message-list {
    padding: 0;
}

.message-item {
    display: flex;
    padding: 15px;
    border-bottom: 1px solid #f0f0f0;
}

.message-number {
    flex-shrink: 0;
    width: 20px;
    color: #666;
    font-size: 14px;
}

.message-content {
    flex: 1;
}

.message-date {
    color: #999;
    font-size: 12px;
    margin-bottom: 5px;
}

.message-text {
    color: #333;
    font-size: 14px;
    line-height: 1.5;
}

.station-message-footer {
    padding: 10px 15px;
    border-top: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
}

.more-btn {
    color: #555;
    font-size: 13px;
    cursor: pointer;
}

.station-message-btn {
    color: #1e90ff;
    font-size: 13px;
    cursor: pointer;
}

.more-btn:hover,
.station-message-btn:hover {
    text-decoration: underline;
}

/* 遮罩层 */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

/* 居中弹窗样式 */
.more-popup-centered {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: 300px;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    overflow: visible;
    border-radius: 20px;
}

.more-popup-container {
    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); */
    min-height: 600px;
}

.close-btn-container {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
}

.popup-header {
    width: 100%;
    height: 160px;
    background-image: url('@/assets/style3/images/foot-info.png');
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
}

.popup-body {
    background-color: white;
    padding: 30px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 300px;
}

.bell-icon-colored {
    width: 80px;
    height: 80px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%2329B6F6'/%3E%3Cpath d='M50 85c4.4 0 8-3.6 8-8h-16c0 4.4 3.6 8 8 8zm24-24v-20c0-12.3-6.5-22.6-18-25.3V12c0-3.3-2.7-6-6-6s-6 2.7-6 6v3.7c-11.5 2.7-18 12.9-18 25.3v20l-8 8v4h64v-4l-8-8zm-8 4H34v-24c0-9.9 6-18 16-18s16 8.1 16 18v24z' fill='%23FFC107'/%3E%3Cpath d='M52 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2' fill='white'/%3E%3Cpath d='M60 35c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2M44 30c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2M65 50c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2M38 55c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2' fill='white' opacity='.6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
}

.no-message-text {
    font-size: 18px;
    color: #333;
    text-align: center;
}

.close-btn {
    cursor: pointer;
    font-size: 24px;
    color: white;
    /* background-color: white; */
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px #ffffff;
}

.close-btn:hover {
    background-color: #f0f0f0;
}

/* 删除旧的样式 */
.more-popup {
    display: none;
}

.more-popup-header {
    display: none;
}

.more-popup-content {
    display: none;
}

.cloud-bell-container {
    display: none;
}

/* 功能反馈弹窗样式 */
.feedback-popup {
    position: fixed;
    bottom: 26px;
    right: 10px;
    z-index: 1000;
    width: 340px;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
}

.feedback-container {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.feedback-header {
    padding: 12px 15px;
    font-size: 16px;
    font-weight: 500;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.feedback-content {
    padding: 20px;
}

.feedback-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.required-label::before {
    content: "* ";
    color: #f56c6c;
}

.feedback-textarea {
    width: 100%;
    height: 120px;
    padding: 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    resize: none;
    font-size: 14px;
    line-height: 1.5;
}

.feedback-textarea:focus {
    outline: none;
    border-color: #409eff;
}

.char-counter {
    text-align: right;
    font-size: 12px;
    color: #999;
}

.form-actions {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

.submit-btn {
    padding: 8px 20px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.submit-btn:hover {
    background-color: #66b1ff;
}
</style>