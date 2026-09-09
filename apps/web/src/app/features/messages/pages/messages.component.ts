import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from '../../../layout/main-layout/main-layout.component';
import { PortalDataService, ContactMessage } from '../../../core/api/portal-data.service';
import { ToastService } from '../../../shared/ui/toast/toast.service';

@Component({
  selector: 'edu-messages',
  standalone: true,
  imports: [FormsModule, MainLayoutComponent],
  template: `
    <edu-main-layout pageTitle="Messages" [breadcrumbs]="['Home', 'Messages']">
      <div class="messages-container">
        <!-- Sidebar Contacts List -->
        <aside class="messages-sidebar">
          <div class="sidebar-top">
            <div class="header-row">
              <h2>Messages</h2>
              <button class="new-msg-btn" (click)="newMessage()">New Message</button>
            </div>
            <div class="search-wrap">
              <input type="text" placeholder="Search messages..." [(ngModel)]="searchQuery" />
            </div>
          </div>

          <div class="contacts-list">
            @for (item of filteredContacts(); track item.contact.id) {
              <div
                class="contact-item"
                [class.active]="selectedContact()?.contact?.id === item.contact.id"
                (click)="selectContact(item)"
              >
                <div class="avatar-wrap">
                  <img [src]="item.contact.avatarUrl" [alt]="item.contact.fullName" />
                  @if (item.contact.id === 'u-sarah') {
                    <span class="online-dot"></span>
                  }
                </div>
                <div class="contact-meta">
                  <div class="top-meta">
                    <b>{{ item.contact.fullName }}</b>
                    <span class="timestamp">{{ item.timestamp }}</span>
                  </div>
                  <span class="role-caption">{{ item.contact.role }}</span>
                  <p class="last-msg">{{ item.lastMessage }}</p>
                </div>
              </div>
            }
          </div>
        </aside>

        <!-- Chat Conversation Area -->
        <main class="chat-main">
          @if (selectedContact(); as active) {
            <header class="chat-header">
              <div class="chat-partner">
                <img [src]="active.contact.avatarUrl" [alt]="active.contact.fullName" class="header-avatar" />
                <div>
                  <h3>{{ active.contact.fullName }}</h3>
                  <span>{{ active.contact.role }}</span>
                </div>
              </div>
            </header>

            <div class="messages-stream">
              <div class="msg-bubble incoming">
                <p>{{ active.lastMessage }}</p>
                <span class="time">{{ active.timestamp }}</span>
              </div>
              @for (msg of chatStream(); track msg.id) {
                <div class="msg-bubble outgoing">
                  <p>{{ msg.text }}</p>
                  <span class="time">{{ msg.time }}</span>
                </div>
              }
            </div>

            <footer class="chat-input-bar">
              <input
                type="text"
                placeholder="Write a reply…"
                [(ngModel)]="outgoingText"
                (keydown.enter)="sendMessage()"
              />
              <button class="send-btn" (click)="sendMessage()">Send</button>
            </footer>
          }
        </main>
      </div>
    </edu-main-layout>
  `,
  styles: [`
    .messages-container {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      display: grid;
      grid-template-columns: 320px 1fr;
      height: calc(100vh - 190px);
      min-height: 520px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    }

    /* Contacts Sidebar */
    .messages-sidebar {
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      background: #ffffff;
    }
    .sidebar-top {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
    }
    .header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .header-row h2 {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
    }
    .new-msg-btn {
      height: 28px;
      padding: 0 12px;
      background: #1868db;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
    }
    .search-wrap input {
      width: 100%;
      height: 32px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 0 10px;
      font-size: 11.5px;
      box-sizing: border-box;
      outline: none;
    }
    .contacts-list {
      flex: 1;
      overflow-y: auto;
    }
    .contact-item {
      display: flex;
      gap: 12px;
      padding: 12px 16px;
      border-bottom: 1px solid #f8fafc;
      cursor: pointer;
      transition: background 0.15s;
    }
    .contact-item:hover {
      background: #f8fafc;
    }
    .contact-item.active {
      background: #eff6ff;
    }
    .avatar-wrap {
      position: relative;
      flex-shrink: 0;
    }
    .avatar-wrap img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
    .online-dot {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 10px;
      height: 10px;
      background: #10b981;
      border: 2px solid white;
      border-radius: 50%;
    }
    .contact-meta {
      flex: 1;
      min-width: 0;
    }
    .top-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .top-meta b {
      font-size: 12.5px;
      color: #0f172a;
    }
    .timestamp {
      font-size: 10px;
      color: #94a3b8;
    }
    .role-caption {
      font-size: 10.5px;
      color: #64748b;
      display: block;
    }
    .last-msg {
      font-size: 11px;
      color: #64748b;
      margin: 2px 0 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Chat Main */
    .chat-main {
      display: flex;
      flex-direction: column;
      background: #fafcff;
    }
    .chat-header {
      height: 60px;
      padding: 0 20px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      background: #ffffff;
    }
    .chat-partner {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      object-fit: cover;
    }
    .chat-partner h3 {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }
    .chat-partner span {
      font-size: 10.5px;
      color: #64748b;
    }

    .messages-stream {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .msg-bubble {
      max-width: 60%;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 12px;
      line-height: 1.4;
    }
    .msg-bubble p {
      margin: 0;
    }
    .msg-bubble .time {
      font-size: 9px;
      display: block;
      margin-top: 4px;
      text-align: right;
    }
    .msg-bubble.incoming {
      align-self: flex-start;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      color: #1e293b;
    }
    .msg-bubble.outgoing {
      align-self: flex-end;
      background: #1868db;
      color: #ffffff;
    }

    .chat-input-bar {
      height: 64px;
      padding: 0 16px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 12px;
      background: #ffffff;
    }
    .chat-input-bar input {
      flex: 1;
      height: 38px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 0 14px;
      font-size: 12px;
      outline: none;
    }
    .send-btn {
      height: 38px;
      padding: 0 18px;
      background: #1868db;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .messages-container { grid-template-columns: 1fr; }
      .chat-main { display: none; }
    }
  `],
})
export class MessagesComponent implements OnInit {
  private portal = inject(PortalDataService);
  private toast = inject(ToastService);

  contacts = signal<ContactMessage[]>([]);
  selectedContact = signal<ContactMessage | null>(null);
  searchQuery = signal('');
  outgoingText = signal('');

  chatStream = signal<Array<{ id: string; text: string; time: string }>>([
    { id: '1', text: 'Hi Sarah, thank you for the feedback! I will test out the signals approach this evening.', time: '2:35 PM' },
  ]);

  ngOnInit() {
    this.portal.getMessages().subscribe((list) => {
      this.contacts.set(list);
      if (list.length > 0) {
        this.selectedContact.set(list[0]);
      }
    });
  }

  selectContact(item: ContactMessage) {
    this.selectedContact.set(item);
  }

  filteredContacts = () => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.contacts();
    return this.contacts().filter(
      (c) => c.contact.fullName.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q),
    );
  };

  sendMessage() {
    const text = this.outgoingText().trim();
    if (!text) return;

    this.chatStream.update((msgs) => [
      ...msgs,
      { id: Date.now().toString(), text, time: 'Just now' },
    ]);
    this.outgoingText.set('');
    this.toast.show('Message sent', 'success');
  }

  newMessage() {
    this.toast.show('Starting a new conversation…', 'info');
  }
}
