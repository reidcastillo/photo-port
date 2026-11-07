// A compact notice in place of the image context menu.
const copyrightNotice = document.createElement('div');
copyrightNotice.className = 'copyright-notice';
copyrightNotice.setAttribute('role', 'status');
copyrightNotice.textContent = 'This photo is Copyright © Reid Castillo. All rights reserved.';
copyrightNotice.hidden = true;
let noticeVisible = false;
const usePopover = typeof copyrightNotice.showPopover === 'function';
if (usePopover) copyrightNotice.setAttribute('popover', 'manual');
document.body.append(copyrightNotice);
function dismissCopyright() {
  if (!noticeVisible) return;
  if (usePopover) copyrightNotice.hidePopover();
  copyrightNotice.hidden = true;
  noticeVisible = false;
}
document.addEventListener('contextmenu', event => {
  if (!(event.target instanceof Element)) return;
  const photo = event.target.closest('img') || event.target.closest('.photo')?.querySelector('img');
  if (!photo) return;
  event.preventDefault();
  dismissCopyright();
  // The popover top layer also works above the full-screen photo dialog.
  if (!usePopover) (photo.closest('dialog') || document.body).append(copyrightNotice);
  copyrightNotice.hidden = false;
  if (usePopover) copyrightNotice.showPopover();
  noticeVisible = true;
  const bounds = photo.getBoundingClientRect();
  const x = event.clientX || bounds.left + bounds.width / 2;
  const y = event.clientY || bounds.top + bounds.height / 2;
  copyrightNotice.style.left = Math.max(12, Math.min(x + 8, innerWidth - copyrightNotice.offsetWidth - 12)) + 'px';
  copyrightNotice.style.top = Math.max(12, Math.min(y + 8, innerHeight - copyrightNotice.offsetHeight - 12)) + 'px';
});
document.addEventListener('pointerdown', event => {
  if (!copyrightNotice.contains(event.target)) dismissCopyright();
}, true);
document.addEventListener('keydown', event => {
  if (noticeVisible && event.key === 'Escape') {
    event.preventDefault(); event.stopImmediatePropagation(); dismissCopyright();
  }
}, true);
document.addEventListener('scroll', dismissCopyright, true);
window.addEventListener('resize', dismissCopyright);
copyrightNotice.addEventListener('click', event => { event.stopPropagation(); dismissCopyright(); });
